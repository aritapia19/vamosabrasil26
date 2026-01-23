import LoginForm from '@/components/Auth/LoginForm';
import styles from './auth-page.module.css';

export default function LoginPage() {
    return (
        <div className={styles.authWrapper}>
            <LoginForm />
        </div>
    );
}
