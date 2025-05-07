function generateKenyanPlate() {
            const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
            const randomNum = Math.floor(Math.random() * 999) + 1;
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            return `KDT ${randomNum.toString().padStart(3, '0')}${randomLetter}`;
        }

        function getCarImageUrl(model, color) {
            return `https://source.unsplash.com/300x150/?${encodeURIComponent(model)}+${encodeURIComponent(color)}+car`;
        }

        const cars = [
            { id: 1, model: "Toyota Corolla", color: "Red", regNumber: generateKenyanPlate(), price: 3500, status: "available" },
            { id: 2, model: "Honda Civic", color: "Blue", regNumber: generateKenyanPlate(), price: 4000, status: "available" },
            { id: 3, model: "Ford Focus", color: "White", regNumber: generateKenyanPlate(), price: 3800, status: "available" },
            { id: 4, model: "Nissan Altima", color: "Black", regNumber: generateKenyanPlate(), price: 4200, status: "available" },
            { id: 5, model: "Hyundai Elantra", color: "Silver", regNumber: generateKenyanPlate(), price: 3700, status: "available" },
            { id: 6, model: "Kia Optima", color: "Gray", regNumber: generateKenyanPlate(), price: 3900, status: "available" }
        ];

        let hires = [];
        let selectedCar = null;

        document.addEventListener('DOMContentLoaded', function() {
            renderCars();
            renderHiresTable();
            populateCarDropdown();
            populateReturnCarDropdown();
            
            document.getElementById('dateHired').addEventListener('change', calculateReturnDate);
            document.getElementById('periodHired').addEventListener('input', calculateReturnDate);
            
            document.getElementById('hirerForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const selectedCarId = document.getElementById('selectedCar').value;
                if (!selectedCarId) {
                    alert('Please select a car');
                    return;
                }
                
                const car = cars.find(c => c.id == selectedCarId);
                if (!car || car.status !== 'available') {
                    alert('Selected car is not available');
                    return;
                }
                
                const hire = {
                    id: hires.length + 1,
                    name: document.getElementById('name').value,
                    idNumber: document.getElementById('id').value,
                    age: document.getElementById('age').value,
                    license: document.getElementById('license').value,
                    carId: car.id,
                    carModel: car.model,
                    regNumber: car.regNumber,
                    price: car.price,
                    dateHired: document.getElementById('dateHired').value,
                    returnDate: document.getElementById('returnDate').value,
                    status: "booked"
                };
                
                hires.push(hire);
                car.status = "booked";
                
                renderHiresTable();
                renderCars();
                populateCarDropdown();
                populateReturnCarDropdown();
                this.reset();
                document.getElementById('returnDate').value = '';
            });
            
            document.getElementById('returnForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const returnName = document.getElementById('returnName').value;
                const returnId = document.getElementById('returnId').value;
                const returnCarId = document.getElementById('returnCar').value;
                const condition = document.querySelector('input[name="condition"]:checked').value;
                const damageDescription = document.getElementById('damageDescription').value;
                
                
                const hireIndex = hires.findIndex(h => 
                    h.name === returnName && 
                    h.idNumber === returnId && 
                    h.carId == returnCarId
                );
                
                if (hireIndex === -1) {
                    alert('No matching hire record found');
                    return;
                }
                
                const hire = hires[hireIndex];
                
                
                hires.splice(hireIndex, 1);
                
                
                const car = cars.find(c => c.id == returnCarId);
                if (car) {
                    car.status = "available";
                }
                console.log('Car returned:', {
                    hireDetails: hire,
                    condition: condition,
                    damageDescription: condition === 'damaged' ? damageDescription : 'None'
                });
                
                alert(`Car returned successfully. Condition: ${condition}`);
                
                renderHiresTable();
                renderCars();
                populateCarDropdown();
                populateReturnCarDropdown();
                this.reset();
            });
        });

        function calculateReturnDate() {
            const dateHired = document.getElementById('dateHired').value;
            const periodHired = document.getElementById('periodHired').value;
            
            if (dateHired && periodHired) {
                const date = new Date(dateHired);
                date.setDate(date.getDate() + parseInt(periodHired));
                
                const returnDate = date.toISOString().split('T')[0];
                document.getElementById('returnDate').value = returnDate;
            }
        }

        function renderCars() {
            const carsGrid = document.getElementById('carsGrid');
            carsGrid.innerHTML = '';
            
            cars.forEach(car => {
                const carCard = document.createElement('div');
                carCard.className = `car-card ${selectedCar && selectedCar.id === car.id ? 'selected' : ''}`;
                
                const statusClass = car.status === 'available' ? 'available' : 'booked';
                const statusText = car.status === 'available' ? 'Available' : 'Booked';
                
                carCard.innerHTML = `
                    <div class="price-tag">KSh ${car.price}/day</div>
                    <div class="status ${statusClass}">${statusText}</div>
                    <div class="loading-img">Loading image...</div>
                    <div class="car-info">
                        <h3>${car.model}</h3>
                        <p>Color: ${car.color}</p>
                        <p>Reg: ${car.regNumber}</p>
                    </div>
                `;
                const imgContainer = carCard.querySelector('.loading-img');
                const img = new Image();
                img.src = getCarImageUrl(car.model, car.color);
                img.alt = car.model;
                img.style.display = 'none';
                img.onload = function() {
                    img.style.display = 'block';
                    imgContainer.innerHTML = '';
                    imgContainer.appendChild(img);
                    imgContainer.classList.remove('loading-img');
                };
                img.onerror = function() {
                    imgContainer.innerHTML = 'Image not available';
                    imgContainer.style.color = '#999';
                };
                
                if (car.status === 'available') {
                    carCard.addEventListener('click', () => {
                        selectedCar = car;
                        document.getElementById('selectedCar').value = car.id;
                        renderCars();
                    });
                }
                
                carsGrid.appendChild(carCard);
            });
        }

        function renderHiresTable() {
            const tableBody = document.getElementById('hiresTableBody');
            tableBody.innerHTML = '';
            
            hires.forEach(hire => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${hire.name}</td>
                    <td>${hire.idNumber}</td>
                    <td>${hire.age}</td>
                    <td>${hire.license}</td>
                    <td>${hire.carModel}</td>
                    <td>${hire.regNumber}</td>
                    <td>KSh ${hire.price}</td>
                    <td>${hire.dateHired}</td>
                    <td>${hire.returnDate}</td>
                    <td><span class="status booked">Booked</span></td>
                `;
                tableBody.appendChild(row);
            });
        }

        function populateCarDropdown() {
            const dropdown = document.getElementById('selectedCar');
            const firstOption = dropdown.options[0];
            dropdown.innerHTML = '';
            dropdown.appendChild(firstOption);
            
            cars.filter(car => car.status === 'available').forEach(car => {
                const option = document.createElement('option');
                option.value = car.id;
                option.textContent = `${car.model} (${car.regNumber}) - KSh ${car.price}/day`;
                dropdown.appendChild(option);
            });
        }

        function populateReturnCarDropdown() {
            const dropdown = document.getElementById('returnCar');
            const firstOption = dropdown.options[0];
            dropdown.innerHTML = '';
            dropdown.appendChild(firstOption);
            
            hires.forEach(hire => {
                const option = document.createElement('option');
                option.value = hire.carId;
                option.textContent = `${hire.carModel} (${hire.regNumber}) - Hired by ${hire.name}`;
                dropdown.appendChild(option);
            });
        }

