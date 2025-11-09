import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../__tests__/test-utils';
import QuestionForm from '../QuestionComponents/QuestionForm';

// Mock CodeEditor
jest.mock('@shared/components/ui/CodeEditor', () => {
  return function MockCodeEditor({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) {
    return (
      <textarea
        data-testid="code-editor"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Code editor"
      />
    );
  };
});

describe('QuestionForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it('should render form fields correctly', () => {
    render(<QuestionForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    expect(screen.getByPlaceholderText('Question title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Question description')).toBeInTheDocument();
    expect(screen.getByText('Attached code:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should validate title is required', async () => {
    const user = userEvent.setup();
    render(<QuestionForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const titleInput = screen.getByPlaceholderText('Question title');
    await user.type(titleInput, 'ab');
    await user.clear(titleInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('should validate title min length', async () => {
    const user = userEvent.setup();
    render(<QuestionForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const titleInput = screen.getByPlaceholderText('Question title');
    await user.type(titleInput, 'ab');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
    });
  });

  it('should validate description is required', async () => {
    const user = userEvent.setup();
    render(<QuestionForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const descriptionInput = screen.getByPlaceholderText('Question description');
    await user.type(descriptionInput, 'short');
    await user.clear(descriptionInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('should validate description min length', async () => {
    const user = userEvent.setup();
    render(<QuestionForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const descriptionInput = screen.getByPlaceholderText('Question description');
    await user.type(descriptionInput, 'short');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument();
    });
  });

  it('should call onSubmit with correct data on valid form submission', async () => {
    const user = userEvent.setup();
    render(<QuestionForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const titleInput = screen.getByPlaceholderText('Question title');
    const descriptionInput = screen.getByPlaceholderText('Question description');
    const codeEditor = screen.getByTestId('code-editor');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(titleInput, 'Test Question Title');
    await user.type(descriptionInput, 'This is a test question description');
    await user.type(codeEditor, 'const test = "code";');

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Question Title',
        description: 'This is a test question description',
        attachedCode: 'const test = "code";',
      });
    });
  });

  it('should disable button when isSubmitting is true', () => {
    render(<QuestionForm onSubmit={mockOnSubmit} isSubmitting={true} submitError={null} />);

    const submitButton = screen.getByRole('button', { name: /processing.../i });
    expect(submitButton).toBeDisabled();
  });

  it('should display submit error when provided', () => {
    render(
      <QuestionForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError="Error submitting question"
      />
    );

    expect(screen.getByText('Error submitting question')).toBeInTheDocument();
  });

  it('should initialize with initialQuestion data', () => {
    const initialQuestion = {
      title: 'Initial Title',
      description: 'Initial Description',
      attachedCode: 'initial code',
    };

    render(
      <QuestionForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        initialQuestion={initialQuestion}
      />
    );

    expect(screen.getByPlaceholderText('Question title')).toHaveValue('Initial Title');
    expect(screen.getByPlaceholderText('Question description')).toHaveValue('Initial Description');
    expect(screen.getByTestId('code-editor')).toHaveValue('initial code');
  });

  it('should use custom submit button text', () => {
    render(
      <QuestionForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        submitButtonText="UPDATE QUESTION"
      />
    );

    expect(screen.getByRole('button', { name: /update question/i })).toBeInTheDocument();
  });

  it('should update code when code editor changes', async () => {
    const user = userEvent.setup();
    render(<QuestionForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const codeEditor = screen.getByTestId('code-editor');
    await user.type(codeEditor, 'new code');

    expect(codeEditor).toHaveValue('new code');
  });
});
