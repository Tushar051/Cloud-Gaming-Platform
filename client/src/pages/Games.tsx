import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import GamesLibrary from "@/components/GamesLibrary";
import { motion } from "framer-motion";

export default function Games() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  // Fetch all games
  const { data: games = [], isLoading, error } = useQuery({
    queryKey: ['/api/games'],
  });
  
  // Function to handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  // Function to handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  // Filter games based on search term and category
  const filteredGames = games.filter((game: any) => {
    // First filter by search term
    const matchesSearch = searchTerm === "" || 
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then filter by category
    const matchesCategory = selectedCategory === "All Categories" || 
      game.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Animation variants for page entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-background pt-24 pb-16"
    >
      <GamesLibrary 
        games={filteredGames}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />
    </motion.div>
  );
}
