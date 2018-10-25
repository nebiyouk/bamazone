<h1>BAMAZON</h1>
<h1>Description</h1>
<p>This application implements a simple command line based storefront using the npm inquirer package and the MySQL database backend together with the npm mysql package. The application presents three interfaces: customer, manager and Executive.</p>

<h2>How It Works</h2>

<h3>Bamazon Customer</h3>

<p>This program consists of three seperate, but related apps. The first, BamazonCustomer.js, allows a "customer" to place an order from the Bamazon store. A check is then performed on the store inventory and the customer is either alerted that their order cannot be completed, or they are shown the total amount owed. Behind the scenes, the quantity ordered by the customer is deducted from the store quantity (which is stored in a SQL table). At the same time, the $ amount of the order is sent to seperate SQL table to allow the corportate executives to track earnings by department.</p>

<h3>To run the customer interface please follow the steps below:</h3>
<ol>
<li>git clone git@ github.com/nebiyouk/bamazone.git</li>
<li>cd bamazon</li>
<li>npm install</li>
<li>node bamazonCustomer.js</li>
</ol>
<h2>Bamazon Manager</h2>
<p>The second app, BamazonManager.js, allows a "manager" to view available items, view low inventory (less than five in stock), add to the inventory, or add a new product.<p>

<h2>Manager Interace</h2>

<h3>The manager interface presents a list of four options, as below.</h3>

<ul>
  <li> ? What would you like to do today? (Use arrow keys)</li>
  <li>    1) View Products for sale </li>
  <li>    2) View low inventory</li>
  <li>    3) Add to inventory </li>
  <li>    4) Add new product </li>
 </ul>

<h2>Bamazon Executive</h2>

<p>The final app, BamazonExecutive.js, allows an "Executive" to view sales by department or add a new department. Adding a new department is an important feature for the executive. While the manager is capable of adding new products, including a department, revenue earned from that department cannot be tracked until after the manager had added that department to executive database.</p>

<h3>The Executive interface presents a list of two options, as below.</h3>
<ul>
<li> ? What would you like to do today? (Use arrow keys)</li>
<li>    1) View Sales By Department</li>
<li>    2) Create New Department</li>
</ul>
<h4>For Video Demo Click The Link Below</h4>

https://drive.google.com/file/d/1cZJUIr4l9FyIMe36s-yFiZJxMmV86l42/view
