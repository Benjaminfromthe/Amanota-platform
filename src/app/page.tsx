import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudentHeader from "@/components/dashboard/StudentHeader";
import MetricsBento from "@/components/dashboard/MetricsBento";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

export default function DashboardPage() {
  return (
    <>
      <Header />

      <main
        style={{
          width: "100%",
          paddingTop: "5rem", /* matches header height */
          backgroundColor: "var(--color-surface)",
          minHeight: "100vh",
        }}
      >
        {/* Hero ambient gradient band */}
        <div
          style={{
            background:
              "linear-gradient(to bottom, rgba(222,232,255,0.4), var(--color-surface) 60%)",
            paddingBottom: "0.5rem",
          }}
        >
          <div
            style={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "2rem 2rem 0",
            }}
          >
            <StudentHeader />
            <MetricsBento />
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 2rem 4rem",
          }}
        >
          <DashboardTabs />
        </div>
      </main>

      <Footer />
    </>
  );
}
