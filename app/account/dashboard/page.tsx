// Import necessary modules and components
import { AppShell, Providers, RouteGuard } from "@/components/providers"

// Import the Sidebar component
import { Sidebar } from "@/components/sidebar"

// Define the Dashboard page component
export default function Dashboard() {
  // Render the Dashboard component
  return (
    <Providers>
      <AppShell>
        <RouteGuard allowedRoles={["user", "admin", "chef", "developer"]}>
          <Sidebar>
            <div className="container py-10 pb-16">
              {/* Your dashboard content goes here */}
              <h1 className="text-2xl font-bold">Account Dashboard</h1>
              <p>Welcome to your account dashboard!</p>
            </div>
          </Sidebar>
        </RouteGuard>
      </AppShell>
    </Providers>
  )
}
