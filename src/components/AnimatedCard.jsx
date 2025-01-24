import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export function AnimatedCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

AnimatedCard.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number
};

export default AnimatedCard;