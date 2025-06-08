import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "tranzbook-46969",
      clientEmail: "firebase-adminsdk-fbsvc@tranzbook-46969.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDG9R9Hpx8ie1Dk\nh8mcAjDj1e3a+9UH6QBFWUTZMq1Ah1IF980cEuHn03JQQhbkqh+d8205wlSLXpdR\njsqm3sKd8PqX2HN6FNjgYrNKJwY2K1BXRkEpmz0olsmlF26zMPYA5XknagBc0aoj\na+la+IkIyq7nDNdX1u+hiJoH+KGKZlgTz5oh+B0odRjGpiOFvAtiSdNP7iGUi5dO\neP8RcthF/2FxC/ysM7HhWQrVrT1kvlW1tKDRWqDKbP0YJXAt5PlbXMqOZE+zDdsj\njw9hu3EwyK66ygA41mVXWYP145dukfW4mwUHmkn1cyRY+tH127bPg++6o6P/3FmK\n/PrEPXqfAgMBAAECggEAWdu46nRNKBY5FVZM1OTabvSernJiJ2XxZODqKwzr2gKk\nJaTjYwQWOs2xyhTnYRSDHiQlF1qxM5cf0cqjtZVToeEGVVGB6kgDIekCIAIbGJkc\neqZ05NVD3JKp9SHtsgnxebsqqoYCLunVJZVl+lvZDHr6Xslac0ZUyYi4RNRjJW3C\n5kEBSORFfDWvBas/3QOqQsA/trs2ZITRuC15VdhnS7mlyRnB4DQRnjiaSHMZrg8x\nwy8xXkolG24yz760wMa7ql71N8lozfEPs+TFjJNoNoFpa8imtotzKsT9fPrhSaKX\ntzyxugyeo14kPFvxwrKof9e1xk/ym0jSDX/liYZkTQKBgQDqQjKnS3PmI3R0zYgJ\naaUIl76TskrVlfnjylVRKNq9WZVDd2YQD7V8+KFJ0g0I9Jtp/tPzhZbxm0gM9Ea8\nDKQm7/9v333uYTAQK2ml287cW/2ab4/UYz4SRrRXwt81etQGwiKKmIAy/hS/z7ah\nVc8Y+q0QRlwe4JBZGI+pxC8BtQKBgQDZbDK5R/dvayJ4/E1ksLk3d6df61A3KE+L\nZzCv35fQcF++JhKClOz/0OAfRuSPORnT/eSuTb6uj5APV1SCRil87fKKdP/c8DSR\nvH7hUaR+2MQtnIwBkxw+Ig7lyioi+c0raj1mDinJIJLP6lE345I1W7hFvS62Ljd4\njenPqH4PgwKBgDbV6h+JJQcxM3iICBkT9sLNKppOOQBITCeLXG9UHegHCU6yq1yF\nINmxJagvGEgJYjvsn9a4Zb4GuFX39HrehqpqsaORcFwVufd/AgsGKiUhD3tQNB3m\nYUhL7rlAb5mIOAug9A73ZcMKAPdpevnHKWRSgaJ2pefAb2m7ux1lRA+lAoGATmdf\nD0NtbedTYg+RlRrJX8AtQkCoB4voy1tlyjY2F7s+O2KdUCuGH2XiPEUjTKaJstGe\nsmBkv6wThgS2+9dzRJLF4Ln6PmD8hAVWN8hqKjfe3pfSQQscpyc++gxiD4THQL2p\n8HBxDw9JAeL8cMwGwGkX1UY4Xwfhhv6d7v1SoCMCgYB86WarKT1/TdtcGBvCbtvO\nbYfA9x5ZcjXAgtGpX1MV4Y2NWhqv/SmOmBTVXA1wJ+T3y/ksJLoZP41dOh3UCNDV\nepf4kk6IttLFio7/Cb5R8nySPikBzaeT09KOmldTekVPCIgBOwDb8vk/8FCddvrP\nmO6oAPSo9jWqII7B80+1xQ==\n-----END PRIVATE KEY-----\n"?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminAuth = getAuth();