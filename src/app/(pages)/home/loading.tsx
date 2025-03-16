"use client";
import { motion } from "framer-motion";
import { Cog } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="p-2  rounded-full"
      >
        <Cog className="size-10"  color= "green"/>
      </motion.div>
    </div>
  );
};

export default loading;
