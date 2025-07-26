import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FormikField } from '../../libs/components/layout/formik-field/FormikField';
import { Button, Card, Input } from '../../libs/components/ui';
import toast from 'react-hot-toast';
import { useOrgRegisterMutation, usePersonalRegisterMutation } from './auth.service';
import { Link, useNavigate } from 'react-router-dom';

type RegistrationType = 'personal' | 'organization';

interface SignUpValues {
  registrationType: RegistrationType;
  email: string;
  password: string;
  confirmPassword: string;
  orgName?: string;
}

const validationSchema = Yup.object({
  registrationType: Yup.string().oneOf(['personal', 'organization']).required(),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
  orgName: Yup.string().when('registrationType', (registrationType, schema) => {
    return registrationType === 'organization'
      ? schema.min(2, 'Too short').required('Organization name is required')
      : schema.notRequired();
  }),
});

export function SignUp() {
  const [personalRegister, { isLoading: isLoadingPersonal }] = usePersonalRegisterMutation();
  const [orgRegister, { isLoading: isLoadingOrg }] = useOrgRegisterMutation();
const navigate = useNavigate();
  const initialValues: SignUpValues = {
    registrationType: 'personal',
    email: '',
    password: '',
    confirmPassword: '',
    orgName: '',
  };

  const handleSubmit = async (values: SignUpValues) => {
    
    try {
      if (values.registrationType === 'personal') {
        
        const response = await personalRegister({
          email: values.email,
          password: values.password,
        }).unwrap();
        console.log(response);
        
        localStorage.setItem('token', response.access_token);
        toast.success('Personal account created and logged in!');
      } else {
        // organization registration expects org name and user
        const response = await orgRegister({
          name: values.orgName,
          email: values.email,
          password: values.password,
        }).unwrap();
        localStorage.setItem('token', response.access_token);
        toast.success('Organization created and logged in!');
        navigate('/dashboard', { replace: true });
      }
      // Redirect or further actions here
    } catch (error: any) {
      toast.error(error?.data?.detail || 'Registration failed');
    }
  };

  const isLoading = isLoadingPersonal || isLoadingOrg;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card title="Sign Up" description="Create a new account" className="max-w-md w-full">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label className="inline-flex items-center mr-6">
                  <Field
                    type="radio"
                    name="registrationType"
                    value="personal"
                    checked={values.registrationType === 'personal'}
                    onChange={() => setFieldValue('registrationType', 'personal')}
                    className="form-radio"
                  />
                  <span className="ml-2">Personal</span>
                </label>
                <label className="inline-flex items-center">
                  <Field
                    type="radio"
                    name="registrationType"
                    value="organization"
                    checked={values.registrationType === 'organization'}
                    onChange={() => setFieldValue('registrationType', 'organization')}
                    className="form-radio"
                  />
                  <span className="ml-2">Organization</span>
                </label>
              </div>

              {values.registrationType === 'organization' && (
                <FormikField
                  name="orgName"
                  label="Organization Name"
                  component={Input}
                  required
                  placeholder="Your organization name"

                  />
              )}

              <FormikField
                name="email"
                label="Email"
                component={Input}
                type="email"
                required
                placeholder="your@email.com"
                className="mt-4"

              />

              <FormikField
                name="password"
                label="Password"
                component={Input}
                type="password"
                required
                placeholder="********"
                className="mt-4"
              />

              <FormikField
                name="confirmPassword"
                label="Confirm Password"
                component={Input}
                type="password"
                required
                placeholder="********"
                className="mt-4"
              />

              <Button type="submit" disabled={isLoading || isSubmitting} className="mt-6 w-full">
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </Form>
          )}
        </Formik>
      <p className="mt-4 text-sm">
  Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
</p>
      </Card>
    </div>
  );
}
