// Fungsi untuk membuat input matriks berdasarkan ukuran yang dipilih
function createMatrixInputs() {
    const size = parseInt(document.getElementById('matrix-size').value);
    const matrixInputs = document.getElementById('matrix-inputs');
    matrixInputs.innerHTML = '';
    
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';
        
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `matrix-${i}-${j}`;
            input.value = i === j ? 1 : 0; // Default: matriks identitas
            
            cell.appendChild(input);
            row.appendChild(cell);
        }
        
        matrixInputs.appendChild(row);
    }
}

// Fungsi untuk mendapatkan nilai matriks dari input
function getMatrixFromInputs() {
    const size = parseInt(document.getElementById('matrix-size').value);
    const matrix = [];
    
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const value = parseFloat(document.getElementById(`matrix-${i}-${j}`).value);
            row.push(isNaN(value) ? 0 : value);
        }
        matrix.push(row);
    }
    
    return matrix;
}

// Fungsi untuk mengkonversi desimal ke pecahan
function decimalToFraction(decimal) {
    if (decimal == 0) return "0";
    if (Number.isInteger(decimal)) return decimal.toString();
    
    // Toleransi untuk pembulatan
    const tolerance = 1.0E-10;
    
    // Konversi negatif
    let sign = decimal < 0 ? "-" : "";
    decimal = Math.abs(decimal);
    
    // Ekstrak bagian bulat
    let whole = Math.floor(decimal);
    decimal -= whole;
    
    if (decimal < tolerance) {
        return sign + whole;
    }
    
    if (1 - decimal < tolerance) {
        return sign + (whole + 1);
    }
    
    // Algoritma untuk mencari pecahan terbaik
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    
    do {
        let a = Math.floor(b);
        let aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
    
    // Format hasil
    if (whole > 0) {
        return sign + whole + " " + h1 + "/" + k1 + "";
    } else {
        return sign + h1 + "/" + k1;
    }
}

// Fungsi untuk menampilkan matriks hasil
function displayMatrix(matrix, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    
    const resultMatrix = document.createElement('div');
    resultMatrix.className = 'result-matrix';
    
    // Tambahkan tanda kurung kiri
    const leftBracket = document.createElement('div');
    leftBracket.className = 'matrix-bracket left-bracket';
    leftBracket.textContent = '[';
    element.appendChild(leftBracket);
    
    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement('div');
        row.className = 'result-row';
        
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            
            // Konversi nilai ke pecahan
            const value = matrix[i][j];
            // Jika nilai sangat kecil (mendekati nol), tampilkan sebagai 0
            if (Math.abs(value) < 1e-10) {
                cell.textContent = '0';
            } else {
                cell.textContent = decimalToFraction(value);
            }
            
            row.appendChild(cell);
        }
        
        resultMatrix.appendChild(row);
    }
    
    element.appendChild(resultMatrix);
    
    // Tambahkan tanda kurung kanan
    const rightBracket = document.createElement('div');
    rightBracket.className = 'matrix-bracket right-bracket';
    rightBracket.textContent = ']';
    element.appendChild(rightBracket);
    
    // Tampilkan hasil section jika tersembunyi
    document.getElementById('results-section').classList.remove('hidden');
}

// Fungsi untuk menghitung determinan matriks 2x2
function determinant2x2(matrix) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

// Fungsi untuk menghitung determinan matriks dengan metode ekspansi kofaktor
function calculateDeterminantValue(matrix) {
    const n = matrix.length;
    
    // Kasus dasar: matriks 1x1
    if (n === 1) {
        return matrix[0][0];
    }
    
    // Kasus matriks 2x2
    if (n === 2) {
        return determinant2x2(matrix);
    }
    
    let det = 0;
    for (let j = 0; j < n; j++) {
        det += matrix[0][j] * cofactor(matrix, 0, j);
    }
    
    return det;
}

// Fungsi untuk menghitung kofaktor
function cofactor(matrix, row, col) {
    const minor = getMinor(matrix, row, col);
    const minorDet = calculateDeterminantValue(minor);
    return Math.pow(-1, row + col) * minorDet;
}

// Fungsi untuk mendapatkan minor (submatriks dengan menghapus baris dan kolom tertentu)
function getMinor(matrix, row, col) {
    const n = matrix.length;
    const minor = [];
    
    for (let i = 0; i < n; i++) {
        if (i === row) continue;
        
        const minorRow = [];
        for (let j = 0; j < n; j++) {
            if (j === col) continue;
            minorRow.push(matrix[i][j]);
        }
        
        minor.push(minorRow);
    }
    
    return minor;
}

// Fungsi untuk menghitung matriks adjoin
function adjoint(matrix) {
    const n = matrix.length;
    const adj = [];
    
    for (let i = 0; i < n; i++) {
        adj[i] = [];
        for (let j = 0; j < n; j++) {
            // Transpose dari matriks kofaktor
            adj[i][j] = cofactor(matrix, j, i);
        }
    }
    
    return adj;
}

// Fungsi untuk menghitung invers matriks
function inverse(matrix) {
    const det = calculateDeterminantValue(matrix);
    
    if (Math.abs(det) < 1e-10) {
        alert('Matriks tidak memiliki invers karena determinan = 0');
        return null;
    }
    
    const adj = adjoint(matrix);
    const inv = [];
    const n = matrix.length;
    
    for (let i = 0; i < n; i++) {
        inv[i] = [];
        for (let j = 0; j < n; j++) {
            inv[i][j] = adj[i][j] / det;
        }
    }
    
    return inv;
}

// Fungsi untuk mengalikan dua matriks
function multiplyMatrices(a, b) {
    const n = a.length;
    const result = [];
    
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            result[i][j] = 0;
            for (let k = 0; k < n; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    
    return result;
}

// Handler untuk tombol Hitung Determinan
function calculateDeterminant() {
    const matrix = getMatrixFromInputs();
    const det = calculateDeterminantValue(matrix);
    
    // Tampilkan determinan dalam format pecahan
    document.getElementById('determinant-value').textContent = decimalToFraction(det);
    document.getElementById('determinant-result').classList.remove('hidden');
    document.getElementById('results-section').classList.remove('hidden');
    
    // Sembunyikan pesan error jika ada
    if (document.getElementById('error-message')) {
        document.getElementById('error-message').classList.add('hidden');
    }
}

// Handler untuk tombol Hitung Invers
function calculateInverse() {
    const matrix = getMatrixFromInputs();
    const inv = inverse(matrix);
    
    if (inv) {
        displayMatrix(inv, 'inverse-matrix');
        document.getElementById('inverse-result').classList.remove('hidden');
    } else {
        const errorMsg = document.getElementById('error-message');
        errorMsg.textContent = 'Matriks tidak memiliki invers karena determinan = 0';
        errorMsg.classList.remove('hidden');
    }
}

// Handler untuk tombol Kalikan dengan Invers
function multiplyWithInverse() {
    const matrix = getMatrixFromInputs();
    const inv = inverse(matrix);
    
    if (inv) {
        const result = multiplyMatrices(matrix, inv);
        displayMatrix(result, 'multiplication-result-matrix');
        document.getElementById('multiplication-result').classList.remove('hidden');
    } else {
        const errorMsg = document.getElementById('error-message');
        errorMsg.textContent = 'Tidak dapat mengalikan dengan invers karena determinan = 0';
        errorMsg.classList.remove('hidden');
    }
}

// Inisialisasi halaman
document.addEventListener('DOMContentLoaded', function() {
    createMatrixInputs();
    
    // Tambahkan class hidden ke elemen hasil jika belum ada
    const resultsElements = ['determinant-result', 'inverse-result', 'multiplication-result', 'error-message'];
    resultsElements.forEach(id => {
        const element = document.getElementById(id);
        if (element && !element.classList.contains('hidden')) {
            element.classList.add('hidden');
        }
    });
    
    // Tambahkan CSS untuk tampilan matriks yang lebih baik
    const style = document.createElement('style');
    style.textContent = `
        .result-matrix {
            display: inline-block;
            margin: 0 5px;
            background-color: #f0f4ff;
            padding: 10px;
            border-radius: 5px;
        }
        .matrix-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 15px 0;
        }
        .matrix-bracket {
            font-size: 2.5em;
            font-weight: bold;
            color: #4f46e5;
            margin: 0 5px;
        }
        .result-cell {
            min-width: 50px;
            text-align: center;
            padding: 5px 10px;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
});