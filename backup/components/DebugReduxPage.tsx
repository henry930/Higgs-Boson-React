import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchPageBySlug } from '../store/features/pages/pagesSlice';

const DebugReduxPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const pagesState = useAppSelector((state) => state.pages);

  console.log('DebugReduxPage render:', {
    slug,
    pagesState,
    entireState: useAppSelector((state) => state)
  });

  useEffect(() => {
    console.log('DebugReduxPage useEffect:', slug);
    if (slug) {
      console.log('Dispatching fetchPageBySlug...');
      const promise = dispatch(fetchPageBySlug(slug));
      console.log('Dispatch returned:', promise);
      
      promise.then((result) => {
        console.log('fetchPageBySlug resolved:', result);
      }).catch((error) => {
        console.log('fetchPageBySlug rejected:', error);
      });
    }
  }, [slug, dispatch]);

  return (
    <div>
      <h1>Redux Debug Page</h1>
      <p>Slug: {slug}</p>
      <pre>{JSON.stringify(pagesState, null, 2)}</pre>
    </div>
  );
};

export default DebugReduxPage;
