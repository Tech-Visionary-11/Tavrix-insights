import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useLoginMutation } from './auth.service';
import { FormikField } from '../../libs/components/layout/formik-field/FormikField';
import toast from 'react-hot-toast';
import { Button, Card, Input } from '../../libs/components/ui';
import { Link, useNavigate } from 'react-router-dom';

interface SignInValues {
  username: string;
  password: string;
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
      console.log(response);
      
      localStorage.setItem('token', response.access_token);
      toast.success('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (err:any) {
        toast.error(err?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card
        title="Sign In"
        description="Enter your credentials to access your account."
        className="max-w-md w-full"
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
      <p className="mt-4 text-sm">
  Don’t have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
</p>
      </Card>
    </div>
  );
}
