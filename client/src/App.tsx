import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { PortalTransition } from "@/components/ui/portal-transition";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Games from "@/pages/Games";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GamingCursor from "./components/GamingCursor";
// Game imports
import GameLayout from "./pages/games/GameLayout";

function Router() {
  const [location] = useLocation();
  const [isPortalVisible, setIsPortalVisible] = useState(false);
  const [targetLocation, setTargetLocation] = useState("");
  
  // State for tracking whether we're changing pages via portal
  const [isChangingPage, setIsChangingPage] = useState(false);

  // Function to handle portal transitions between pages
  const handlePortalTransition = (path: string) => {
    setIsPortalVisible(true);
    setTargetLocation(path);
    setIsChangingPage(true);
    
    // After portal animation completes, change the page
    setTimeout(() => {
      window.history.pushState({}, "", path);
      setIsPortalVisible(false);
      setIsChangingPage(false);
    }, 1200);
  };

  return (
    <>
      {!isChangingPage && <Header />}
      
      <PortalTransition isVisible={isPortalVisible} />
      
      <main className="min-h-screen">
        <Switch>
          <Route 
            path="/" 
            component={() => <Home onEnterArena={() => handlePortalTransition("/games")} />} 
          />
          <Route path="/games" component={Games} />
          {/* Game routes */}
          <Route path="/games/:gameId*" component={GameLayout} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {!isChangingPage && location !== "/" && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <div className="noise-overlay"></div>
        <Router />
        <Toaster />
       {/* Temporarily disabled for better navigation */}
        {/* <GamingCursor /> */}
      </div>
    </QueryClientProvider>
  );
}

export default App;
