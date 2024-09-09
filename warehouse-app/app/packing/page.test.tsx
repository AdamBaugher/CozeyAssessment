import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PickingPage from './page';
import { useRouter } from 'next/navigation';
import fetchMock from 'jest-fetch-mock';
import { format } from 'date-fns';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// jest.mock('react-datepicker', () => (props: any) => (
//   <input
//     type="date"
//     onChange={(e) => props.onChange(new Date(e.target.value))}
//     value={props.selected ? format(props.selected, 'yyyy-MM-dd') : ''}
//     placeholder='Select a date'
//   />
// ));

fetchMock.enableMocks();

describe('PickingPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    fetchMock.resetMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render PickingPage with date picker and table', () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(<PickingPage />);

    // Check the back button
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();

    // Check the header
    expect(screen.getByText('Packing List')).toBeInTheDocument();

    // Check the DatePicker
    expect(screen.getByPlaceholderText('Select a date')).toBeInTheDocument();
  });

  it('should fetch and display orders based on selected date', async () => {
    const mockOrders = [
      {
        orderDate: '2024-09-10',
        lineItems: [
          {
            name: 'Item 1',
            quantity: 2,
            products: [{ name: 'Product 1', quantity: 1 }]
          },
          {
            name: 'Item 2',
            quantity: 1,
            products: [{ name: 'Product 2', quantity: 2 }]
          }
        ],
        customerName: 'Customer A',
        shippingAddress: '123 Address St',
      }
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockOrders));

    render(<PickingPage />);

    const formattedDate = format(new Date(), 'yyyy-MM-dd');
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(`/api/orders/${formattedDate}`);
    });

    // Wait for the orders to be displayed
    await waitFor(() => {
      expect(screen.getByText('Item 1 * 2')).toBeInTheDocument();
      expect(screen.getByText('Product 1 * 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2 * 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2 * 2')).toBeInTheDocument();
      expect(screen.getByText('Customer A (123 Address St)')).toBeInTheDocument();
    });
  });

  it('should make a new request when picking a new date', async () => {
    const mockOrders = [
      {
        orderDate: '2024-09-10',
        lineItems: [],
        customerName: 'Customer B',
        shippingAddress: '456 Another St',
      }
    ];
    fetchMock.mockResponseOnce(JSON.stringify([]));
    fetchMock.mockResponseOnce(JSON.stringify(mockOrders));
    
    render(<PickingPage />);

    const dateInput = screen.getByPlaceholderText('Select a date');
    expect(dateInput).toBeInTheDocument();

    const newDate = '2024-09-11';
    fireEvent.change(dateInput, { target: { value: newDate } });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(`/api/orders/${newDate}`);
    });
  });

  it('should navigate back to the dashboard when back button is clicked', () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(<PickingPage />);

    const backButton = screen.getByText('Back to Dashboard');
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should fetch orders on initial render with the current date', async () => {
    const mockOrders = [
      {
        orderDate: '2024-09-10',
        lineItems: [],
        customerName: 'Customer B',
        shippingAddress: '456 Another St',
      }
    ];

    fetchMock.mockResponses(JSON.stringify(mockOrders));

    render(<PickingPage />);

    const formattedDate = format(new Date(), 'yyyy-MM-dd');
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(`/api/orders/${formattedDate}`);
    });

    await waitFor(() => {
      expect(screen.getByText('Customer B (456 Another St)')).toBeInTheDocument();
    });
  });
});
