var colors = require('colors');
var Table = require('cli-table');
var inquirer = require('inquirer');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'Bamazon_db'
});

//Establish Connection - Call the Manager Input function
connection.connect(function (err) {
	if (err) throw err;
	console.log('connected as id: ' + connection.threadId)
	startPrompt();
});


//FUNCTIONS
//=============================================================

//Prompt the user for the action they would like to perform and then call the new transaction function
function startPrompt() {
	inquirer.prompt([{
		type: 'list',
		name: 'input',
		message: 'What would you like to do today?'.cyan,
		choices: ['1) View Products for sale', '2) View low inventory', '3) Add to inventory', '4) Add new product']
	}]).then(function (answer) {
		if (answer.input === '1) View Products for sale') {
			inventoryView();
		} else if (answer.input === '2) View low inventory') {
			lowInventory();
		} else if (answer.input === '3) Add to inventory') {
			addInventory();
		} else if (answer.input === '4) Add new product') {
			addProduct();
		}
	});

	function inventoryView() {
		var table = new Table({
			head: ['Item ID', 'Product Name', 'DepartmentName','Price', 'Quantity'],
			colWidths: [10, 30, 30, 30, 10]
		});

		listInventory();

		function listInventory() {
			connection.query('SELECT * FROM products', function (err, res) {
				for (i = 0; i < res.length; i++) {
					var itemId = res[i].id,
						productName = res[i].ProductName,
						DepartmentName = res[i].DepartmentName,
						price = res[i].Price,
						Quantity = res[i].StockQuantity;

					table.push(
						[itemId, productName, DepartmentName, price, Quantity]
					);
				}
		
				console.log("");
				console.log('_.~"~._.~"~._.~"~._.~"~._.~"~._.~"~._.~"~._.~CURRENT BAMAZON INVENTORY~._.~"~._.~"~._.~"~._.~"~._.~"~._.~"~._.~"~._'.green );
				console.log("");
				console.log(table.toString());
				console.log("");
				confirmPrompt();
			});
		}
	}


	function lowInventory() {
		// instantiate
		var table = new Table({
			head: ['ID', 'ProductName', 'DepartmentName','StockQuantity'],
			colWidths: [10, 30, 30, 10]
		});

		listLowInventory();
		function listLowInventory() {
			connection.query('SELECT * FROM products WHERE StockQuantity <= 5', function (err, res) {
				for (i = 0; i < res.length; i++) {
					
                    var itemId = res[i].id,
                        productName = res[i].ProductName,
                        DepartmentName = res[i].DepartmentName,
						stockQuantity = res[i].StockQuantity;
						
						table.push(
							[itemId, productName, DepartmentName, stockQuantity]
							);
						}
					
					console.log("");
					console.log("====================".green + "Low Bamazon Inventory (5 or Less in Stock)".red + "========n==============".green);
					console.log("");
					console.log(table.toString());
					console.log("");
					confirmPrompt();
				});
			}
		}
							
	
		function addInventory() {
			inquirer.prompt([{
				name: 'item',
				message: 'Enter the ID of the item you wish to update:'.cyan,
				validate: function (value) {
					var valid = value.match(/^[0-9]+$/)
					if (valid) {
						return true
					}
					return 'Please enter a numerical value'
				}
			}, {
				name: 'number',
				message: 'How many items would you like to add to the current supply?'.cyan,
				validate: function (value) {
					var valid = value.match(/^[0-9]+$/)
					if (valid) {
						return true
					}
					return 'Please enter a numerical value'
				}
			}]).then(function (answer) {
				connection.query('SELECT * FROM products WHERE id = ?', [answer.item], function (err, res) {
					connection.query('UPDATE products SET ? Where ?', [{
						StockQuantity: res[0].StockQuantity + parseInt(answer.number)
					}, {
						id: answer.item
					}], function (err, res) { });
				})
				console.log('Inventory updated');
				confirmPrompt();
			})
		}

		function addProduct() {
		inquirer.prompt([{
			name: 'product',
			message: 'Enter name of product:'.red
		}, {
			name: 'department',
			message: 'Enter a department for this product'.red
		}, {
			name: 'price',
			message: 'Enter a price for this product'.red,
			validate: function (value) {
				var valid = value.match(/^[0-9]+$/)
				if (valid) {
					return true
				}
				return 'Please enter a numerical value'.red
			}
		}, {
			name: 'stock',
			message: 'Please enter a stock quantity for this product'.red,
			validate: function (value) {
				var valid = value.match(/^[0-9]+$/)
				if (valid) {
					return true
				}
				return 'Please enter a numerical value'.red
			}
		}]).then(function (answer) {
			connection.query('INSERT into products SET ?', {
				ProductName: answer.product,
				DepartmentName: answer.department,
				Price: answer.price,
				StockQuantity: answer.stock
			}, function (err, res) { });
			console.log('Product Added');
			confirmPrompt();
		})
	}
}

//Prompt the user to see if they would like to perform another transaction or end the connection
function confirmPrompt() {
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to perform another Task?'.cyan
	}]).then(function (answer) {
		if (answer.choice) {
			startPrompt();
		}
		else {
			console.log("");
			console.log('Have a Good One'.green);
			connection.end();
		}
	})
}