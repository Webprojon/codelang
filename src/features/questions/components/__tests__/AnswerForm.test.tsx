import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../__tests__/test-utils';
import AnswerForm from '../AnswerComponents/AnswerForm';

describe('AnswerForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it('should render form correctly for new answer', () => {
    render(<AnswerForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    expect(screen.getByText('Your Answer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your answer here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post answer/i })).toBeInTheDocument();
  });

  it('should render form correctly for editing answer', () => {
    const initialAnswer = {
      content: 'Existing answer content',
    };

    render(
      <AnswerForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        initialAnswer={initialAnswer}
      />
    );

    expect(screen.getByText('Edit Your Answer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your answer here...')).toHaveValue(
      'Existing answer content'
    );
  });

  it('should validate content is required', async () => {
    const user = userEvent.setup();
    render(<AnswerForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const contentInput = screen.getByPlaceholderText('Write your answer here...');
    await user.type(contentInput, 'short');
    await user.clear(contentInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Answer content is required')).toBeInTheDocument();
    });
  });

  it('should validate content min length', async () => {
    const user = userEvent.setup();
    render(<AnswerForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const contentInput = screen.getByPlaceholderText('Write your answer here...');
    await user.type(contentInput, 'short');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Answer must be at least 10 characters')).toBeInTheDocument();
    });
  });

  it('should call onSubmit with correct data on valid form submission', async () => {
    const user = userEvent.setup();
    render(<AnswerForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const contentInput = screen.getByPlaceholderText('Write your answer here...');
    const submitButton = screen.getByRole('button', { name: /post answer/i });

    await user.type(contentInput, 'This is a valid answer with enough content');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        content: 'This is a valid answer with enough content',
      });
    });
  });

  it('should reset form after submission for new answer', async () => {
    const user = userEvent.setup();
    render(<AnswerForm onSubmit={mockOnSubmit} isSubmitting={false} submitError={null} />);

    const contentInput = screen.getByPlaceholderText('Write your answer here...');
    const submitButton = screen.getByRole('button', { name: /post answer/i });

    await user.type(contentInput, 'This is a valid answer with enough content');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Form should be reset for new answer
    expect(contentInput).toHaveValue('');
  });

  it('should disable button when isSubmitting is true', () => {
    render(<AnswerForm onSubmit={mockOnSubmit} isSubmitting={true} submitError={null} />);

    const submitButton = screen.getByRole('button', { name: /processing.../i });
    expect(submitButton).toBeDisabled();
  });

  it('should display submit error when provided', () => {
    render(
      <AnswerForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError="Error submitting answer"
      />
    );

    expect(screen.getByText('Error submitting answer')).toBeInTheDocument();
  });

  it('should show cancel button when onCancel is provided', () => {
    const mockOnCancel = jest.fn();
    render(
      <AnswerForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();

    render(
      <AnswerForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should reset form when cancel is clicked', async () => {
    const mockOnCancel = jest.fn();
    const user = userEvent.setup();

    render(
      <AnswerForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        onCancel={mockOnCancel}
      />
    );

    const contentInput = screen.getByPlaceholderText('Write your answer here...');
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await user.type(contentInput, 'Some content');
    await user.click(cancelButton);

    expect(contentInput).toHaveValue('');
  });

  it('should use custom submit button text', () => {
    render(
      <AnswerForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        submitButtonText="UPDATE ANSWER"
      />
    );

    expect(screen.getByRole('button', { name: /update answer/i })).toBeInTheDocument();
  });

  it('should initialize with initialAnswer data', () => {
    const initialAnswer = {
      content: 'Initial answer content',
    };

    render(
      <AnswerForm
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        submitError={null}
        initialAnswer={initialAnswer}
      />
    );

    expect(screen.getByPlaceholderText('Write your answer here...')).toHaveValue(
      'Initial answer content'
    );
  });
});
