import React from 'react';
import styles from '../document.module.css';
import { formatDate } from '../../../utils/dateUtils';

export const DocBasicInfo = ({ title, description, visibility, category, authors, date }) => {
  
  return (
    <div className={styles.basicInfo}>
      {/* Title */}
      <h1 className={styles.title}>{title}</h1>

      {/* Authors */}
      {/* TODO: quit the commas if there's nothing in the name and also, the last comma */}
      <a href='#' className={styles.authorText}>
        {authors.map((aut, index) => (
          <span id={index} key={index} className={aut.estaRegistrado ? styles.authorTextReg : styles.authorTextUnReg}>
            {aut.nombre}
          </span>
        )).reduce((prev, curr) => [prev, ', ', curr])}
      </a>

      {/* Date */}
      <div>
        <p className={styles.dateInfo}>{formatDate(date)}</p>
      </div>

      {/* Description */}
      <div>
        <h3 className={styles.descriptionTitle}>Descripción</h3>
        <p className={styles.descriptionText}>{description}</p>
      </div>

      {/* Visibility */}
      <div className={styles.visibilityContainer}>
        <span className={`${styles.visibility} ${visibility === 'publico' ? styles.public : styles.private}`}>
          {visibility}
        </span>
      </div>

      {/* Categories */}
      <div className={styles.categoriesContainer}>
        {category.map((cat, index) => (
          <span key={index} className={styles.categoryBadge}>
            {cat.nombre}
          </span>
        ))}
      </div>
    </div>
  );
};
