let Lx;
let Ly;
let nx;
let ny;
let eps;
let maxIt;
let T1;
let T2;
let T3;
let T4;

// Copies matrix z1 into z2
function copy(z1, nx, ny) {
   let z2 = new Array(nx).fill(0).map(()=>Array(ny).fill(0));
   for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j ++) {
         z2[i,j] = z1[i,j]
      }
   }
   return z2;
}

// Dirichlet boundary conditions
function dirichletBC(z, nx, ny, b1, b2, b3, b4) {
   for (let i = 0; i < nx; i++) {
      z[i][0] = b1;
      z[i][ny-1] = b4;
   }
   for (let j = 0; j < ny; j++) {
      z[0][j] = b2;
      z[nx-1][j] = b3;
   }
   // edges
   z[0][0] = (z[0][1]+z[1][0])/2;
   z[0][ny-1] = (z[0][ny-2]+z[1][ny-1])/2;
   z[nx-1][0] = (z[nx-1][1]+z[nx-2][0])/2;
   z[nx-1][ny-1] = (z[nx-2][ny-1]+z[nx-1][ny-2])/2;
   return z;
}

// Check for convergence
function checkConvergence(z, z0, nx, ny, eps) {
   let maxDiff;
   for (let i = 1; i < nx - 1; i++) {
      for (let j = 1; j < ny - 1; j++) {
         maxDiff = Math.abs(z[i][j]-z0[i][j]);
         if (maxDiff < eps) {
            return true;
         }
      }
   }
   return false;
}

// Solve differential equation
function solve(z, z0, nx, ny, eps, maxIt) {
   for (let it = 0; it < maxIt; it++) {
      z0 = JSON.parse(JSON.stringify(z)); // deep copy
      for (let i = 1; i < nx-1; i++) {
         for (let j = 1; j < ny-1; j++) {
            z[i][j] = (z[i+1][j]+z[i-1][j]+z[i][j+1]+z[i][j-1])/4;
         }
      }
      if (checkConvergence(z, z0, nx, ny, eps) == true) {
         alert("Solution converged after " + it + " iterations.")
         return z;
      }
   }
   alert("Solution did not converged!");
   return z;
}

function plot(Z) {
   let data = [{
      z: Z,
      zsmooth: 'best',
      type: 'heatmap',
      showscale: true,
      connectgaps: true,
      xaxis: 'x4',
      yaxis: 'y4',
      colorscale: 'Jet',
    }];
    
    let layout = {
    //  title: 'Contour plot'
    };
    
    Plotly.newPlot('plot', data, layout);
}

function compute() {
   Lx = +document.getElementById("Lx").value;
   Ly = +document.getElementById("Ly").value;
   nx = +document.getElementById("nx").value;
   ny = +document.getElementById("ny").value;
   eps = +document.getElementById("eps").value;
   maxIt = +document.getElementById("maxIt").value;
   T1 = +document.getElementById("T1").value;
   T2 = +document.getElementById("T2").value;
   T3 = +document.getElementById("T3").value;
   T4 = +document.getElementById("T4").value;
   let T = new Array(nx).fill(0).map(()=>Array(ny).fill(0));
   let T0 = new Array(nx).fill(0).map(()=>Array(ny).fill(0));
   T = dirichletBC(T, nx, ny, T1, T2, T3, T4);
   T0 = dirichletBC(T0, nx, ny, T1, T2, T3, T4);
   T = solve(T, T0, nx, ny, eps, maxIt);
   plot(T);
}

document.getElementById("solve").addEventListener("click", compute);
  
