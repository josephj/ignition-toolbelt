import { useEffect, useState } from 'react';
import { PracticeQuery } from '@generated/console/requests';
import { fetchConsolePracticeData } from './utils';

export const useConsolePractice = ({
  id,
  csrfToken,
}: {
  id?: string;
  csrfToken: string;
}) => {
  const [data, setData] = useState<PracticeQuery>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchConsolePracticeData(id, csrfToken)
        .then((practiceData) => {
          if (practiceData) {
            setData(practiceData);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, csrfToken]);

  return {
    data,
    loading,
  };
};
