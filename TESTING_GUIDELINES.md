# Testing Guidelines - Behavior Driven Development (BDD)

This project follows Behavior Driven Development (BDD) principles for testing. This document outlines our testing philosophy and guidelines.

## What is BDD?

Behavior Driven Development is an Agile development methodology that emphasizes **collaboration** among developers, quality assurance testers, and business stakeholders. It encourages teams to use conversation and concrete examples to formalize a shared understanding of how the software application should behave.

BDD evolved from Test-Driven Development (TDD) and focuses on:

- **User behavior**: How the application should behave from the user's perspective
- **Collaboration**: Cross-functional teams working together to understand requirements
- **Executable specifications**: Using domain-specific language to write tests that serve as both documentation and validation

## Core BDD Principles We Follow

### 1. Focus on Behavior, Not Implementation

- Tests should verify **what** the system does from a user's perspective
- Focus on user-facing behavior and functionality
- Avoid testing internal implementation details like CSS classes or DOM structure

### 2. Use Given-When-Then Structure

BDD scenarios follow the Gherkin format:

- **Given**: The initial context or preconditions
- **When**: The action or event that triggers the behavior
- **Then**: The expected outcome or result

### 3. Write Tests in Business Language

Test descriptions should be written as behavioral specifications that business stakeholders can understand:

- ✅ `should allow user to navigate back to projects list`
- ❌ `renders as a button when no URL is provided`

### 4. Test User Scenarios, Not Components in Isolation

Focus on complete user workflows and behaviors:

- Can users accomplish their goals?
- Do interactions work as expected?
- Are error states handled appropriately?

### 5. Collaborate Across Roles

BDD involves "The Three Amigos":

- **Business**: Defines the problem and requirements
- **Development**: Determines how to implement the solution
- **Testing**: Questions the solution and explores edge cases

## What We Test vs What We Don't Test

### ✅ User Behaviors and Scenarios

- **Navigation**: Can users navigate between pages and sections?
- **Content Display**: Is the right content shown to users?
- **Interactions**: Do buttons, links, and forms work as expected?
- **Accessibility**: Are elements accessible to screen readers and keyboard navigation?
- **User Workflows**: Can users complete their intended tasks?

### ✅ Functional Requirements

- Form submissions and validation
- Data loading and error states
- User authentication and authorization
- API responses and error handling
- State management and persistence

### ❌ Implementation Details

- Specific CSS classes for styling (`text-xl`, `bg-blue-500`, `flex`)
- Internal component structure or DOM hierarchy
- Exact positioning, sizing, or visual appearance
- Framework-specific implementation details
- Private methods or internal state

### ❌ Visual Design Elements

- Color schemes and typography choices
- Layout and spacing (unless it affects functionality)
- Animations and transitions (unless they impact user experience)
- Responsive breakpoints (test behavior, not specific pixel values)

## Example: Real BDD Transformation

### ❌ Before: Component-Focused Testing

```javascript
// Testing implementation details and visual styling
it('applies correct color classes', () => {
  render(<Button color="secondary">Secondary Button</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('bg-accent-secondary');
});

it('should render button with secondary color variant', () => {
  render(<Button color="secondary">Secondary Button</Button>);
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent('Secondary Button');
});

it('should render button with large size variant', () => {
  render(<Button size="lg">Large Button</Button>);
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent('Large Button');
});
```

### ✅ After: User Behavior-Focused Testing

```javascript
// Testing user scenarios and behaviors
describe('User Navigation', () => {
  it('should allow user to navigate to external links when URL is provided', () => {
    // Given: A button component with an external URL
    render(<Button url="https://github.com/user/repo">View Project</Button>);

    // When: User encounters the navigation element
    const link = screen.getByRole('link', { name: /view project/i });

    // Then: It should be accessible and point to the correct destination
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/user/repo');
  });

  it('should allow user to download files when download is enabled', () => {
    // Given: A button configured for file download
    render(
      <Button url="/resume.pdf" download>
        Download Resume
      </Button>,
    );

    // When: User interacts with the download link
    const downloadLink = screen.getByRole('link', { name: /download resume/i });

    // Then: It should have the download attribute for browser handling
    expect(downloadLink).toHaveAttribute('download');
  });

  it('should prevent user interaction when button is disabled', () => {
    // Given: A disabled button in a form
    render(<Button disabled>Submit Form</Button>);

    // When: User tries to interact with the button
    const button = screen.getByRole('button', { name: /submit form/i });

    // Then: The button should be inaccessible for interaction
    expect(button).toBeDisabled();
  });
});
```

### Key Differences:

1. **Focus**: Implementation details → User scenarios and goals
2. **Language**: Technical assertions → Business-readable descriptions
3. **Structure**: Component props → Given-When-Then user workflows
4. **Value**: Visual consistency → Functional behavior that matters to users

## BDD Test Structure

### Given-When-Then Pattern

Structure tests following the BDD scenario format:

```javascript
it('should [expected behavior] when [condition]', () => {
  // Given: Set up the initial context
  render(<Component initialState="ready" />);

  // When: Trigger the behavior
  const element = screen.getByRole('button');

  // Then: Assert the expected outcome
  expect(element).toBeAccessible();
});
```

### Three Stages of BDD Implementation

1. **Discovery**: Collaborative workshops to identify user needs and scenarios
2. **Formulation**: Convert scenarios into executable specifications using Gherkin-like structure
3. **Automation**: Implement automated tests that validate the specified behaviors

## Testing Anti-Patterns to Avoid

### ❌ Over-Testing Visual Variants

```javascript
// Don't test every visual variation
it('renders primary button correctly', () => {
  /* ... */
});
it('renders secondary button correctly', () => {
  /* ... */
});
it('renders large button correctly', () => {
  /* ... */
});
it('renders small button correctly', () => {
  /* ... */
});
```

### ❌ Testing Implementation Details

```javascript
// Don't test internal structure
expect(component.find('.inner-wrapper')).toHaveLength(1);
expect(component.state('isLoading')).toBe(false);
```

### ❌ Brittle CSS Class Testing

```javascript
// Don't test styling classes
expect(button).toHaveClass('px-4', 'py-2', 'rounded-md');
```

## When CSS Classes ARE Acceptable to Test

Only test CSS classes when they serve a **functional** purpose:

✅ **Acceptable cases:**

- Custom className props that affect behavior (`className="custom-validation-error"`)
- State-indicating classes that can't be tested semantically (`aria-expanded="true"` is better)
- Classes critical for third-party library integration

❌ **Avoid testing:**

- Styling classes (`text-xl`, `bg-blue-500`, `flex`)
- Layout classes (`grid`, `space-y-4`, `container`)
- Visual appearance classes (`font-bold`, `shadow-lg`)

## BDD Best Practices for Our Project

### 1. Write User-Centric Test Names

- ✅ `should allow user to navigate back to projects list`
- ✅ `should display error message when form submission fails`
- ❌ `renders BackButton component correctly`
- ❌ `handles onClick prop properly`

### 2. Focus on User Scenarios

Test complete user workflows, not isolated component behaviors:

```javascript
describe('Project Portfolio Navigation', () => {
  it('should allow user to browse projects and return to main list', () => {
    // Test the complete user journey
  });
});
```

### 3. Use Business Domain Language

Write tests that business stakeholders can understand:

- Use terms from the problem domain (portfolio, projects, resume)
- Avoid technical jargon (props, state, hooks)
- Focus on user goals and outcomes

### 4. Test Behavior, Not Structure

```javascript
// ✅ Good: Testing user-facing behavior
expect(screen.getByRole('navigation')).toBeInTheDocument();
expect(screen.getByText('Projects')).toBeInTheDocument();

// ❌ Bad: Testing implementation structure
expect(component.find('nav > ul > li')).toHaveLength(3);
```

### 5. Collaborative Test Development

Follow the "Three Amigos" approach:

- **Business perspective**: What should this feature do for users?
- **Development perspective**: How can we implement this behavior?
- **Testing perspective**: What could go wrong? What edge cases exist?

## Resources and Further Reading

- [Behavior-Driven Development - Wikipedia](https://en.wikipedia.org/wiki/Behavior-driven_development)
- [BDD Documentation - Cucumber](https://cucumber.io/docs/bdd/)
- [LambdaTest BDD Guide](https://www.lambdatest.com/learning-hub/behavior-driven-development)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/)

## Summary

Remember: **BDD is about testing the right things** - user behaviors and business value - **not just testing things right** through comprehensive component coverage. Focus on what users actually care about and what provides real business value.
