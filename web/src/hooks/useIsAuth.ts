import { useCurrentUserQuery } from 'generated/graphql';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useIsAuth = () => {
  const router = useRouter();
  const [{ data, fetching }] = useCurrentUserQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!fetching && !data?.currentUser) {
      const destination = `/login?next=${encodeURIComponent(router.pathname)}`;
      router.replace(destination);
    } else {
      setIsAuthenticated(true);
    }
  }, [data, fetching, router]);

  return { isAuthenticated, fetching, user: data?.currentUser };
};
