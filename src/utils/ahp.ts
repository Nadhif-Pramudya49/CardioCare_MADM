import { AHPMatrix } from '../types';

export const RI_VALUES: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49
};

/**
 * Creates an initial n x n matrix with 1s on the diagonal
 */
export function createEmptyMatrix(n: number): AHPMatrix {
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      matrix[i][j] = i === j ? 1 : 1;
    }
  }
  return matrix;
}

/**
 * Normalizes the columns of the AHP matrix
 */
export function normalizeMatrix(matrix: AHPMatrix): AHPMatrix {
  const n = matrix.length;
  const colSums = new Array(n).fill(0);
  
  // Calculate sum of each column
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += matrix[i][j];
    }
  }

  // Create normalized matrix
  const normalized: number[][] = [];
  for (let i = 0; i < n; i++) {
    normalized[i] = [];
    for (let j = 0; j < n; j++) {
      normalized[i][j] = matrix[i][j] / colSums[j];
    }
  }

  return normalized;
}

/**
 * Calculates the Eigenvector (Priority Weights)
 * by taking the average of each row in the normalized matrix
 */
export function calculateEigenvector(normalizedMatrix: AHPMatrix): number[] {
  const n = normalizedMatrix.length;
  const eigenvector = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let rowSum = 0;
    for (let j = 0; j < n; j++) {
      rowSum += normalizedMatrix[i][j];
    }
    eigenvector[i] = rowSum / n;
  }

  return eigenvector;
}

/**
 * Calculates Lambda Max (Principal Eigenvalue)
 */
export function calculateLambdaMax(matrix: AHPMatrix, eigenvector: number[]): number {
  const n = matrix.length;
  let lambdaMax = 0;

  for (let i = 0; i < n; i++) {
    let rowSumProduct = 0;
    for (let j = 0; j < n; j++) {
      rowSumProduct += matrix[i][j] * eigenvector[j];
    }
    lambdaMax += rowSumProduct / eigenvector[i];
  }

  return lambdaMax / n;
}

/**
 * Calculates Consistency Index (CI)
 */
export function calculateCI(lambdaMax: number, n: number): number {
  if (n <= 1) return 0;
  return (lambdaMax - n) / (n - 1);
}

/**
 * Calculates Consistency Ratio (CR)
 */
export function calculateCR(ci: number, n: number): number {
  const ri = RI_VALUES[n] || 1.49; // Default to max RI if > 10 (though n=5 here)
  if (ri === 0) return 0;
  return ci / ri;
}

/**
 * Checks if the matrix is consistent (CR < 0.10)
 */
export function isConsistent(cr: number): boolean {
  return cr < 0.10;
}

/**
 * Runs the full AHP calculation pipeline
 */
export function calculateAHP(matrix: AHPMatrix) {
  const n = matrix.length;
  const normalized = normalizeMatrix(matrix);
  const weights = calculateEigenvector(normalized);
  const lambdaMax = calculateLambdaMax(matrix, weights);
  const ci = calculateCI(lambdaMax, n);
  const cr = calculateCR(ci, n);

  return {
    normalizedMatrix: normalized,
    weights,
    lambdaMax,
    ci,
    cr,
    isConsistent: isConsistent(cr)
  };
}
