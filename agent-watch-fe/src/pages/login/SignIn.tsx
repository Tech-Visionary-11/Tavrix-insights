import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useLoginMutation } from './auth.service';
import { FormikField } from '../../libs/components/layout/formik-field/FormikField';
import toast from 'react-hot-toast';
import { Button, Card, Input } from '../../libs/components/ui';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";

interface SignInValues {
  username: string;
  password: string;
}

interface JwtPayload {
  exp: number; // Expiry time in seconds
}

export function SignIn() {
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();
  const initialValues: SignInValues = { username: '', password: '' };

  const validationSchema = Yup.object({
    username: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too short').required('Required'),
  });

  const handleSubmit = async (values: SignInValues) => {
    try {
      const response = await login(values).unwrap();
      const token = response.access_token;

      const decoded: JwtPayload = jwtDecode(token);
      const expiresAt = new Date(decoded.exp * 1000);

      Cookies.set('auth_token', token, {
        expires: expiresAt,
        secure: true,
        sameSite: 'Strict',
      });

      toast.success('Login successful!');
      navigate('/', { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        {/* ✅ App name above the card */}
       <h1 className="text-3xl font-extrabold text-center mb-8
  text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500
  drop-shadow-lg tracking-tight"
>
  Tavrix Insights
</h1>

        <Card
          title="Sign In"
          description="Enter your credentials to access your account."
          className="w-full"
        >
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormikField
                  name="username"
                  label="Email"
                  component={Input}
                  type="email"
                  required
                  placeholder="your@email.com"
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

                {error && (
                  <p className="text-red-600 mt-2 text-sm">
                    {(error as any).data?.detail || 'Login failed'}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="mt-4 w-full"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form>
            )}
          </Formik>

          <p className="mt-4 text-sm text-center">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
