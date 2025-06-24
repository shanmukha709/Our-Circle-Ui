import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './AnimatedIntro.css';
import logoImage from '../../assets/logo.png';

const AnimatedIntro = () => {
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTitle(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="intro-container">
      <motion.img
        src={logoImage}
        alt="Our Circle Logo"
        className="intro-logo"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
      />

      <div className="title-wrapper">
        {showTitle && (
          <motion.h1
            className="intro-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {"OUR CIRCLE".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ marginRight: char === " " ? "8px" : "0" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        )}
      </div>
    </div>
  );
};

export default AnimatedIntro;
