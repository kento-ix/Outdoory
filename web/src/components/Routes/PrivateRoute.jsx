// components/Routes/PrivateRoute.jsx
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { isLoggedInAtom, showLoginModalAtom } from '../../store/authAtoms';

const PrivateRoute = ({ element: Component }) => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [, setShowLoginModal] = useAtom(showLoginModalAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // ログインしていない場合、モーダルを表示してホームに戻る
      setShowLoginModal(true);
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, setShowLoginModal, navigate]);

  // ログインしている場合のみコンポーネントを表示
  return isLoggedIn ? <Component /> : null;
};

export default PrivateRoute;