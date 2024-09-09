import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PickingPage from './page';
import { useRouter } from 'next/navigation';
import fetchMock from 'jest-fetch-mock';
import { format } from 'date-fns';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-datepicker', () => (props: any) => (
  <input
    type="date"
    onChange={(e) => props.onChange(new Date(e.target.value))}
    value={props.selected}
  />
));

fetchMock.enableMocks();

describe('PickingPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    fetchMock.resetMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render PickingPage with date picker and table', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(<PickingPage />);

    // Check the back button
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();

    // Check the header
    expect(screen.getByText('Picking List')).toBeInTheDocument();
  });

  it('should fetch and display products based on selected date', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 100, quantity: 10 },
      { id: 2, name: 'Product 2', price: 200, quantity: 20 },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockProducts));

    render(<PickingPage />);

    const formattedDate = format(new Date(), 'yyyy-MM-dd');
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(`/api/products/${formattedDate}`);
    });

    const product1 = screen.getByText('Product 1');
    const product2 = screen.getByText('Product 2');
    
    expect(product1).toBeInTheDocument();
    expect(product2).toBeInTheDocument();
  });

  it('should navigate back to the dashboard when back button is clicked', () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));

    render(<PickingPage />);

    const backButton = screen.getByText('Back to Dashboard');
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should open modal with product details when "Details" button is clicked', async () => {
    const mockProductDetails = {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      quantity: 10,
    };

    fetchMock.mockResponseOnce(JSON.stringify([{ id: 1, name: 'Product 1', price: 100, quantity: 10 }]));
    fetchMock.mockResponseOnce(JSON.stringify(mockProductDetails));

    render(<PickingPage />);

    // Wait for the products to be loaded
    await waitFor(() => screen.getByText('Product 1'));

    const detailsButton = screen.getByRole('button', { name: /details/i });
    fireEvent.click(detailsButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/product/1');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });
});
