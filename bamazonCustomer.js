var colors = require('colors');
var Table = require('cli-table');
var inquirer = require('inquirer');
var mysql = require('mysql');

var amountOwed;
var currentDepartment;
var updateSales;

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'Bamazon_db'
});

//Establish Connection
connection.connect(function (err) {
	if (err) throw err;
	console.log('connected as id: ' + connection.threadId)
});
//FUNCTIONS
//=============================================================================
function showProducts() {
	var table = new Table({
		head: ['Item ID', 'Product Name', 'Price', 'Quantity'],
		colWidths: [10, 30, 30, 10]
	});
	showProducts();
	//Displays all items available in store and then calls the place order function
	function showProducts() {
		connection.query('SELECT * FROM products', function (err, res) {
			for (i = 0; i < res.length; i++) {
				var itemId = res[i].id,
					productName = res[i].ProductName,
					price = res[i].Price,
					Quantity = res[i].StockQuantity;
				table.push(
					[itemId, productName, price, Quantity]
				);
			}
			console.log("");
			console.log('_.~"~._.~"~._.~"~._.~"~._.~"~._.~Bamazone ITEM For Sale~._.~"~._.~"~.__.~"~.__.~"~._'.green );
			console.log("");
			console.log(table.toString());
			console.log("");
			placeOrder();
		});
	}
}

//Prompts the user to place an order, fulfills the order, and then calls the new order function
function placeOrder() {
	inquirer.prompt([{
		name: 'selectId',
		message: 'Please enter the ID of the product you wish to purchase'.cyan,
		validate: function (value) {
			var valid = value.match(/^[0-9]+$/)
			if (valid) {
				return true
			}
			return 'Please enter a valid Product ID'.cyan
		}
	}, {
		name: 'selectQuantity',
		message: 'How many of this product would you like to order?'.cyan,
		validate: function (value) {
			var valid = value.match(/^[0-9]+$/)
			if (valid) {
				return true
			}
			return 'Please enter a numerical value'
		}
	}]).then(function (answer) {
		connection.query('SELECT * FROM products WHERE id = ?', [answer.selectId], function (err, res) {
			if (answer.selectQuantity > res[0].StockQuantity) {
				console.log('Insufficient Quantity'.red);
				console.log('This order has been cancelled'.red);
				console.log('');
				newOrder();
			}
			else {
				amountOwed = res[0].Price * answer.selectQuantity;
				currentDepartment = res[0].DepartmentName;
				console.log("===================================");
				console.log("Awesome! We can fulfill your order.".green);
				console.log("===================================");
				console.log("You've selected:".cyan);
				console.log("----------------".cyan);
				console.log("Item ID: ".green + answer.selectId);
				console.log("Quantity: ".green+ answer.selectQuantity);
				console.log("----------------".cyan);
				console.log('Your Total is: $'.green + amountOwed);
				console.log("===================================");
				//update products table
				newStockQuantity = (res[0].StockQuantity - answer.selectQuantity);
				newid = (answer.selectId);
				logSaleToDepartment();
				confirmPrompt(newStockQuantity, newid);
			}

		})

	}, function (err, res) { })
};

function confirmPrompt(newStockQuantity, newid) {

	inquirer.prompt([{

		type: "confirm",
		name: "confirmPurchase",
		message: "Are you sure you would like to purchase this item and quantity?".red,
		default: true

	}]).then(function (userConfirm) {
		if (userConfirm.confirmPurchase === true) {

			//if user confirms purchase, update mysql database with new stock quantity by subtracting user quantity purchased.

			connection.query("UPDATE products SET ? WHERE ?", [{
				StockQuantity: newStockQuantity
			}, {
				id: newid
			}], function (err, res) { });

			console.log("=================================");
			console.log("Transaction completed. Thank you.".green);
			console.log("=================================");
			newOrder();
		} else {
			console.log("=================================");
			console.log("No worries. Maybe next time!".cyan);
			console.log("=================================");
			newOrder();
		}
	});
}
//Allows the user to place a new order or end the connection
function newOrder() {
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to place another order?'.cyan
	}]).then(function (answer) {
		if (answer.choice) {
			placeOrder();
		}
		else {
			console.log('Thank you for shopping at Bamazon!'.green);
			connection.end();
		}
	})
};


//functions to push the sales to the executive table
function logSaleToDepartment() {
	connection.query('SELECT * FROM departments WHERE DepartmentName = ?', [currentDepartment], function (err, res) {
		updateSales = res[0].TotalSales + amountOwed;
		updateDepartmentTable();
	})
};

function updateDepartmentTable() {
	connection.query('UPDATE departments SET ? WHERE ?', [{
		TotalSales: updateSales
	}, {
		DepartmentName: currentDepartment
	}], function (err, res) { });
};
//Call the original function (all other functions are called within this function)
//======================================================================
showProducts();
