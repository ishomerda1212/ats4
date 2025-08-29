import { Router } from './app/router/Router';
import { AuthProvider } from './features/auth';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;