import RegisterForm from '@/components/Auth/RegisterForm';
import styles from './auth-page.module.css';

export default function RegisterPage() {
    return (
        <div className={styles.authWrapper}>
            <RegisterForm />
        </div>
    );
}
