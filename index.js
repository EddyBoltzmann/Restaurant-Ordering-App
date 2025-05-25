/**
 * @format
 */

import { AppRegistry } from "react-native"
import App from "./App"
import { name as appName } from "./app.json"
import { AuthProvider } from "./contexts/auth-context"

// Wrap the app with the AuthProvider
const AppWithProviders = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
)

AppRegistry.registerComponent(appName, () => AppWithProviders)
