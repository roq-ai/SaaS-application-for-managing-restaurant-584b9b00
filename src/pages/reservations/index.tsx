import AppLayout from 'layout/app-layout';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getReservations } from 'apiSdk/reservations';
import { ReservationsInterface } from 'interfaces/reservations';
import { Error } from 'components/error';

function ReservationsListPage() {
  const { data, error, isLoading } = useSWR<ReservationsInterface[]>(() => true, getReservations);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Reservations
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Customer_id</Th>
                  <Th>Restaurant_id</Th>
                  <Th>Date</Th>
                  <Th>Time</Th>
                  <Th>Created_at</Th>
                  <Th>Updated_at</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.id}</Td>
                    <Td>{record.customer_id}</Td>
                    <Td>{record.restaurant_id}</Td>
                    <Td>{record.date.toDateString()}</Td>
                    <Td>{record.time.toDateString()}</Td>
                    <Td>{record.created_at.toDateString()}</Td>
                    <Td>{record.updated_at.toDateString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default ReservationsListPage;