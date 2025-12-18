import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../__tests__/test-utils';
import SnippetForm from '../SnippetForm';
import { useLanguages } from '@features/snippets/hooks/useLanguages';

// Mock dependencies
jest.mock('@features/snippets/hooks/useLanguages');
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

const mockUseLanguages = useLanguages as jest.MockedFunction<typeof useLanguages>;

describe('SnippetForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
    mockUseLanguages.mockReturnValue({
      languages: ['JavaScript', 'Python', 'Java', 'C++'],
      isLoading: false,
      error: null,
    });
  });

  it('should render form fields correctly', () => {
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    expect(screen.getByText('Language of your snippet:')).toBeInTheDocument();
    expect(screen.getByText('Code of your snippet:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should show loading spinner when languages are loading', () => {
    mockUseLanguages.mockReturnValue({
      languages: [],
      isLoading: true,
      error: null,
    });

    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    // LoadingSpinner should be rendered
    expect(screen.queryByText('Language of your snippet:')).not.toBeInTheDocument();
  });

  it('should render language select with options', () => {
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const languageSelect = screen.getByLabelText(/language/i);
    expect(languageSelect).toBeInTheDocument();
  });

  it('should disable button when code is empty or whitespace', async () => {
    const user = userEvent.setup();
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const codeEditor = screen.getByTestId('code-editor');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Button should be disabled initially (empty code)
    expect(submitButton).toBeDisabled();

    // Type only whitespace - button should still be disabled
    await user.type(codeEditor, '   ');

    // Wait a bit for state update
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should validate code cannot be empty', async () => {
    const user = userEvent.setup();
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const codeEditor = screen.getByTestId('code-editor');
    await user.type(codeEditor, '   '); // Only whitespace
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Code cannot be empty')).toBeInTheDocument();
    });
  });

  it('should call onSubmit with correct data on valid form submission', async () => {
    const user = userEvent.setup();
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const codeEditor = screen.getByTestId('code-editor');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(codeEditor, 'const test = "code";');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'const test = "code";',
          language: 'JavaScript',
        })
      );
    });
  });

  it('should trim code before submission', async () => {
    const user = userEvent.setup();
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const codeEditor = screen.getByTestId('code-editor');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(codeEditor, '   const test = "code";   ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'const test = "code";',
        })
      );
    });
  });

  it('should disable button when isSubmitting is true', () => {
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={true} submitError={null} />);

    const submitButton = screen.getByRole('button', { name: /processing.../i });
    expect(submitButton).toBeDisabled();
  });

  it('should disable button when code is empty', () => {
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable button when code is provided', async () => {
    const user = userEvent.setup();
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const codeEditor = screen.getByTestId('code-editor');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).toBeDisabled();

    await user.type(codeEditor, 'const test = "code";');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should display submit error when provided', () => {
    render(
      <SnippetForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError="Error submitting snippet"
      />
    );

    expect(screen.getByText('Error submitting snippet')).toBeInTheDocument();
  });

  it('should initialize with initialSnippet data', () => {
    const initialSnippet = {
      id: '1',
      code: 'initial code',
      language: 'Python',
      marks: [],
      user: {
        id: '1',
        username: 'testuser',
        role: 'user',
      },
      comments: [],
    };

    render(
      <SnippetForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        initialSnippet={initialSnippet}
      />
    );

    expect(screen.getByTestId('code-editor')).toHaveValue('initial code');
  });

  it('should use custom submit button text', () => {
    render(
      <SnippetForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        submitButtonText="UPDATE SNIPPET"
      />
    );

    expect(screen.getByRole('button', { name: /update snippet/i })).toBeInTheDocument();
  });

  it('should update code when code editor changes', async () => {
    const user = userEvent.setup();
    render(<SnippetForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const codeEditor = screen.getByTestId('code-editor');
    await user.type(codeEditor, 'new code');

    expect(codeEditor).toHaveValue('new code');
  });
});
