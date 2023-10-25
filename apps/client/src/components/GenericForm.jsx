import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const GenericForm = ({ initialValues, validationSchema, fields, onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form>
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            <Field type={field.type} id={field.name} name={field.name} />
            <ErrorMessage name={field.name} component="div" className="error" />
          </div>
        ))}
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default GenericForm;
