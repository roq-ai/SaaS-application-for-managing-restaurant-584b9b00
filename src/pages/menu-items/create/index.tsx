import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikBag } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createMenu_items } from 'apiSdk/menu_items';
import { Error } from 'components/error';
import { Menu_itemsInterface } from 'interfaces/menu_items';
import { AsyncSelect } from 'components/async-select';
import { MenusInterface } from 'interfaces/menus';
import { getMenus } from 'apiSdk/menus';

function Menu_itemsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: Menu_itemsInterface, { resetForm }: FormikBag<any, any>) => {
    setError(null);
    try {
      await createMenu_items(values);
      resetForm();
      router.push('/menu-items');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<Menu_itemsInterface>({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      created_at: new Date(new Date().toDateString()),
      updated_at: new Date(new Date().toDateString()),
      menu_id: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      description: yup.string(),
      price: yup.number().integer().required(),
      created_at: yup.date().required(),
      updated_at: yup.date().required(),
      menu_id: yup.string().required(),
    }),
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Menu_items
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors.description}</FormErrorMessage>}
          </FormControl>
          <FormControl id="price" mb="4" isInvalid={!!formik.errors.price}>
            <FormLabel>price</FormLabel>
            <NumberInput
              name="price"
              value={formik.values.price}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.price && <FormErrorMessage>{formik.errors.price}</FormErrorMessage>}
          </FormControl>
          <FormControl id="created_at" mb="4">
            <FormLabel>created_at</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values.created_at}
              onChange={(value: Date) => formik.setFieldValue('created_at', value)}
            />
          </FormControl>
          <FormControl id="updated_at" mb="4">
            <FormLabel>updated_at</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values.updated_at}
              onChange={(value: Date) => formik.setFieldValue('updated_at', value)}
            />
          </FormControl>
          <AsyncSelect<MenusInterface>
            formik={formik}
            name={'menu_id'}
            label={'Menus'}
            placeholder={'Select Menus'}
            fetcher={getMenus}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.id}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default Menu_itemsCreatePage;
