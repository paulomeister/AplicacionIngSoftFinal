import React from 'react';
import styles from '../document.module.css';
import { formatDate } from '../../../utils/dateUtils';
import Link from 'next/link';

export const DocBasicInfo = ({ title, description, visibility, category, authors, date, username }) => {
  
  return (
    <div className={styles.basicInfo}>
      {/* Title */}
      <h1 className={styles.title}>{title}</h1>

      {/* Authors */}
      {authors
          ?.filter(aut => aut.nombre)
          .map((aut, index, array) => (
            <Link href={`/perfilDocuments/${aut.username}`} className={styles.authorText} key={index}>
              <span
                id={index}
                key={index}
                className={aut.estaRegistrado ? styles.authorTextReg : styles.authorTextUnReg}
              >
                {aut.nombre}
              </span>
            </Link>
          ))
          .reduce((prev, curr, index) => (
            index === 0 ? [curr] : [...prev, ', ', curr] // Añadir coma entre autores, pero no al final
          ), [])
        }
      


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
        {category?.map((cat, index) => (
          <span key={index} className={styles.categoryBadge}>
            {cat.nombre}
          </span>
        ))}
      </div>
    </div>
  );
};
