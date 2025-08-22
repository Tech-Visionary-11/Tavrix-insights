import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FormikField } from '../../libs/components/layout/formik-field/FormikField';
import { Button, Card, Input } from '../../libs/components/ui';
import toast from 'react-hot-toast';
import { useOrgRegisterMutation, usePersonalRegisterMutation } from './auth.service';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';


type RegistrationType = 'personal' | 'organization';

interface JwtPayload {
  exp: number;
}

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
  orgName: Yup.string().when('registrationType', (registrationType, schema) =>
    registrationType === 'organization'
      ? schema.min(2, 'Too short').required('Organization name is required')
      : schema.notRequired()
  ),
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
      let response;
      if (values.registrationType === 'personal') {
        response = await personalRegister({
          email: values.email,
          password: values.password,
        }).unwrap();
        toast.success('Personal account created and logged in!');
      } else {
        response = await orgRegister({
          org: { name: values.orgName || '' },  // wrap org name inside org field to match API
          user: { email: values.email, password: values.password, personal: false },
        }).unwrap();
        toast.success('Organization created and logged in!');
      }

      const token = response.access_token;
      const decoded: JwtPayload = jwtDecode(token);
      const expiresAt = new Date(decoded.exp * 1000); 

      Cookies.set('auth_token', token, {
        expires: expiresAt,
        secure: true,
        sameSite: 'Strict',
      });

      navigate('/', { replace: true });
    } catch (error: any) {
      // Handle error with detailed messages if available
      if (error?.data?.detail) {
        if (Array.isArray(error.data.detail)) {
          // For validation errors represented as arrays
          error.data.detail.forEach((err: any) => toast.error(err.msg || JSON.stringify(err)));
        } else if (typeof error.data.detail === 'string') {
          toast.error(error.data.detail);
        } else {
          toast.error('Registration failed due to unknown error.');
        }
      } else {
        toast.error('Registration failed.');
      }
    }
  };

  const isLoading = isLoadingPersonal || isLoadingOrg;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md">
      <h1
          className="text-3xl font-extrabold text-center mb-8
            text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500
            drop-shadow-lg tracking-tight"
        >
          Tavrix Insights
        </h1>
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
                    className="form-radio "
                    disabled
                  />
                  <span className="ml-2 text-gray-500">Organization</span>
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
    </div>
  );
}
