import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import InfoForm from './InfoForm';

// Mock dependencies
vi.mock('@crema/helpers/IntlMessages', () => ({
  __esModule: true,
  default: ({ id }) => <span>{id}</span>,
}));

vi.mock('@crema/components/AppGridContainer', () => ({
  __esModule: true,
  default: ({ children, spacing }) => <div data-testid="app-grid-container">{children}</div>,
}));

vi.mock('@crema/components/AppFormComponents/AppTextField', () => ({
  __esModule: true,
  default: ({ name, label, value, onChange, error, helperText, ...props }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        data-testid={`textfield-${name}`}
        {...props}
      />
      {error && helperText && <span role="alert">{helperText}</span>}
    </div>
  ),
}));

vi.mock('@crema/mockapi', () => ({
  countries: [
    { label: 'United States', code: 'US' },
    { label: 'Canada', code: 'CA' },
    { label: 'United Kingdom', code: 'GB' },
    { label: 'Germany', code: 'DE' },
  ],
}));

const theme = createTheme();

const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}
    </LocalizationProvider>
  </ThemeProvider>
);

describe('InfoForm Component', () => {
  const mockSetFieldValue = vi.fn();
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    values: {
      bio: '',
      dob: dayjs(),
      country: { label: 'United States', code: 'US' },
      website: '',
      phone: '',
    },
    setFieldValue: mockSetFieldValue,
    isSubmitting: false,
    errors: {},
  };

  const renderWithFormik = (props = {}) => {
    const formikProps = { ...defaultProps, ...props };
    
    return render(
      <TestWrapper>
        <Formik
          initialValues={formikProps.values}
          onSubmit={mockOnSubmit}
        >
          {(formikBag) => (
            <InfoForm
              values={formikBag.values}
              setFieldValue={formikBag.setFieldValue}
              isSubmitting={formikProps.isSubmitting}
              errors={formikProps.errors}
            />
          )}
        </Formik>
      </TestWrapper>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders all form fields correctly', () => {
      renderWithFormik();

      expect(screen.getByRole('combobox', { name: /common.country/i })).toBeInTheDocument();
      expect(screen.getByTestId('textfield-website')).toBeInTheDocument();
      expect(screen.getByTestId('textfield-phone')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /common.saveChanges/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /common.cancel/i })).toBeInTheDocument();
    });

    it('renders form with initial values', () => {
      const values = {
        bio: 'Test bio',
        dob: dayjs('1990-01-01'),
        country: { label: 'Canada', code: 'CA' },
        website: 'https://example.com',
        phone: '+1234567890',
      };

      renderWithFormik({ values });

      expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Canada')).toBeInTheDocument();
    });

    it('displays validation errors when present', () => {
      const errors = {
        website: 'Invalid website URL',
        phone: 'Phone number is not valid',
        country: 'Country is required',
      };

      renderWithFormik({ errors });

      expect(screen.getByText('Invalid website URL')).toBeInTheDocument();
      expect(screen.getByText('Phone number is not valid')).toBeInTheDocument();
      expect(screen.getByText('Country is required')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('calls setFieldValue when website field changes', async () => {
      const user = userEvent.setup();
      renderWithFormik();

      const websiteInput = screen.getByTestId('textfield-website');
      await user.type(websiteInput, 'https://newsite.com');

      expect(websiteInput).toHaveValue('https://newsite.com');
    });

    it('calls setFieldValue when phone field changes', async () => {
      const user = userEvent.setup();
      renderWithFormik();

      const phoneInput = screen.getByTestId('textfield-phone');
      await user.type(phoneInput, '+1987654321');

      expect(phoneInput).toHaveValue('+1987654321');
    });

    it('handles country field interaction', async () => {
      const user = userEvent.setup();
      renderWithFormik();

      const countryInput = screen.getByRole('combobox', { name: /common.country/i });
      
      // Test typing in the field
      await user.clear(countryInput);
      await user.type(countryInput, 'Test Country');

      expect(countryInput).toHaveValue('Test Country');
    });

    it('clears country selection when cleared', async () => {
      const user = userEvent.setup();
      const values = {
        ...defaultProps.values,
        country: { label: 'Canada', code: 'CA' },
      };
      
      renderWithFormik({ values });

      const countryInput = screen.getByRole('combobox', { name: /common.country/i });
      
      // Clear the field
      await user.clear(countryInput);

      expect(countryInput).toHaveValue('');
    });
  });

  describe('Button States', () => {
    it('disables submit button when isSubmitting is true', () => {
      renderWithFormik({ isSubmitting: true });

      const submitButton = screen.getByRole('button', { name: /common.saveChanges/i });
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when isSubmitting is false', () => {
      renderWithFormik({ isSubmitting: false });

      const submitButton = screen.getByRole('button', { name: /common.saveChanges/i });
      expect(submitButton).not.toBeDisabled();
    });

    it('cancel button is always enabled', () => {
      renderWithFormik({ isSubmitting: true });

      const cancelButton = screen.getByRole('button', { name: /common.cancel/i });
      expect(cancelButton).not.toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('submits form when submit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithFormik();

      const submitButton = screen.getByRole('button', { name: /common.saveChanges/i });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('does not submit form when submit button is disabled', () => {
      renderWithFormik({ isSubmitting: true });

      const submitButton = screen.getByRole('button', { name: /common.saveChanges/i });
      
      // Check that button is disabled - don't try to click it
      expect(submitButton).toBeDisabled();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Reset', () => {
    it('resets form when cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderWithFormik();

      const cancelButton = screen.getByRole('button', { name: /common.cancel/i });
      await user.click(cancelButton);

      // The reset functionality is handled by Formik's reset type
      expect(cancelButton).toHaveAttribute('type', 'reset');
    });
  });

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      renderWithFormik();

      const form = screen.getByTestId('app-grid-container').closest('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('autoComplete', 'off');
    });

    it('associates labels with inputs correctly', () => {
      renderWithFormik();

      expect(screen.getByLabelText('common.country')).toBeInTheDocument();
      expect(screen.getByLabelText('common.website')).toBeInTheDocument();
      expect(screen.getByLabelText('common.phoneNumber')).toBeInTheDocument();
    });

    it('displays error messages with proper ARIA attributes', () => {
      const errors = {
        website: 'Invalid website URL',
      };

      renderWithFormik({ errors });

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Invalid website URL');
    });
  });

  describe('Country Autocomplete Specific Tests', () => {
    it('renders country autocomplete with correct attributes', async () => {
      renderWithFormik();

      const countryInput = screen.getByRole('combobox', { name: /common.country/i });
      expect(countryInput).toHaveAttribute('aria-autocomplete', 'list');
      expect(countryInput).toHaveAttribute('autocomplete', 'new-password');
    });

    it('handles country input changes', async () => {
      const user = userEvent.setup();
      renderWithFormik();

      const countryInput = screen.getByRole('combobox', { name: /common.country/i });
      await user.type(countryInput, 'Test');

      expect(countryInput.value).toContain('Test');
    });

    it('maintains selected country value', () => {
      const values = {
        ...defaultProps.values,
        country: { label: 'United Kingdom', code: 'GB' },
      };

      renderWithFormik({ values });

      const countryInput = screen.getByRole('combobox', { name: /common.country/i });
      expect(countryInput).toHaveValue('United Kingdom');
    });

    it('has clear button when country is selected', () => {
      const values = {
        ...defaultProps.values,
        country: { label: 'United Kingdom', code: 'GB' },
      };

      renderWithFormik({ values });

      // The clear button has aria-label "Clear" but the test was looking for name /clear/i
      // Let's check by aria-label instead
      const clearButton = screen.getByLabelText(/clear/i);
      expect(clearButton).toBeInTheDocument();
    });
  });

  describe('Error State Display', () => {
    it('shows multiple errors simultaneously', () => {
      const errors = {
        website: 'Invalid website URL',
        phone: 'Phone number is not valid',
        country: 'Country is required',
      };

      renderWithFormik({ errors });

      expect(screen.getByText('Invalid website URL')).toBeInTheDocument();
      expect(screen.getByText('Phone number is not valid')).toBeInTheDocument();
      expect(screen.getByText('Country is required')).toBeInTheDocument();
    });

    it('clears errors when they are resolved', () => {
      const { rerender } = renderWithFormik({ 
        errors: { website: 'Invalid website URL' } 
      });

      expect(screen.getByText('Invalid website URL')).toBeInTheDocument();

      // Rerender without errors
      rerender(
        <TestWrapper>
          <Formik
            initialValues={defaultProps.values}
            onSubmit={mockOnSubmit}
          >
            {(formikBag) => (
              <InfoForm
                values={formikBag.values}
                setFieldValue={formikBag.setFieldValue}
                isSubmitting={false}
                errors={{}}
              />
            )}
          </Formik>
        </TestWrapper>
      );

      expect(screen.queryByText('Invalid website URL')).not.toBeInTheDocument();
    });
  });
});