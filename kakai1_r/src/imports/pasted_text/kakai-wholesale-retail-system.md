Share thru localhost - xampp/apache/conf/httpd.conf - xampp/htdocs - Require all granted

tools:
database - MySQL
frontend - html, css, js, bootstraps (icons, tables), swal
programming language - php

file structure:
frontend, backend, config, database

kakai's kutkutin wholesale and retail system: inventory management, sales control and analytics profitability.

security:
use PDO
role base session (rbac)
bcrypt password hashing

design:
compatible to any devices (desktop, tablet, mobile)
works on all browser (ios, android, etc.)

users:
administrator - all access
staff - for new employee without specific task
stockman - view all inventory warehouse (wholesale, retail, store shelf)
cashier - default view pos, store shelf stocks
customer - available products

pages:
Admin Dashboard
Stockman Dashboard
Cashier Dashboard
Customer Page (customer)
Daily Operations (cashier, admin)
 	- POS
 	- create online orders
Inventory
 	- wholesale (stockman)
 	- retail (stockman)
 	- store shelf (cashier)
Business Intelligence
 	- Profitability reports
 	- Inventory forecast
 	- Expiry and Low stock tracker
User management and RBAC/ACL (admin)
Activity logger (admin)

ADMIN DASHBOARD displays and features:

HOME/DASHBOARD

KPI cards for:
 	total sales
 	net profit
 	crit stocks (clickable redirect to expiry and low stock tracker)
 	expiring items (30 days before expiry date) (clickable redirect to expiry and low stock tracker)
Top 3 selling products (can be filtered by week or month)

inventory intelligence
 	shows products in table
 	Item | Wholesale (Boxes) | Retail Warehouse (pcs) | Store Shelf (pcs) | Suggested Action

SIDEBAR: (accordion)
 	Daily operation:
 		Point Of Sale (POS)
		- common POS
 		Create orders from online (SMS, facebook page)

 	Inventory and Logistics:
 		Product master list
 			- (table) shows all product with prices and stock count in wholesale, retail warehouse and store shelf
 		Receive and Return Products (single page)
 			Receive shipment
- receive product from supplier
 			Damage/loss entry
				- (table) record of damage products. Back Orders (BO)
 		Inventory Control (single page)
			Stock Levels for Wholesale, Retail warehouse and Store shelf
 				- display remaining stocks of the products
 			Bulk breakdown (explode) - wholesale to retail
- transfer product from wholesale warehouse to retail warehouse
			Stock transfer - retail to store shelf
 				- (table) transfer product from retail warehouse to store self
 			Stock adjustments (for manual fix)
				- (table) manually adjust stocks
 			Stock movements
- (table) shows stock movements across warehouses and store
 		Supplier directory
 			- (table) lists of suppliers their products and price of it

 	Business Intelligence:
 		Profitability reports
 			- (line, bar, pie charts) sales report that can be filtered by weekly, monthly
 		Inventory forecast
			- (table) forecast how many days the remaining stocks lasts

 		Expiry and Low stock tracker
			- (table) display products with low stocks and expiring date

 	User Management:
 		user profiles
 			- (table) lists of employees with assigned role
- manage add, delete, update of employees. assign role of employee
 		Access Control (RBAC/ACL)
			- lists of access that can be granted to employees (all buttons, features)

 			-
 	Activity log
	- activities happened in the whole system

	Logout

STOCKMAN DASHBOARD

Inventory and Logistics:
 		Product master list
 			- (table) shows all product with prices and stock count
 		Receive and Return Products (single page)
 			Receive shipment
- receive product from supplier
 			Damage/loss entry
 				- (table) record of damage products. Back Orders (BO)
 		Inventory Control (single page)
 			Bulk breakdown (explode) - wholesale to retail
- transfer product from wholesale warehouse to retail warehouse
 			Stock transfer - retail to store shelf
 				- (table) transfer product from retail warehouse to store self
 			Stock adjustments (for manual fix)
 				- (table) manually adjust stocks
 			Stock movements
- (table) shows stock movements across warehouses and store
 		Supplier directory
 			- (table) lists of suppliers their products and price of it

CASHIER DASHBOARD

Daily operation:

 	Point Of Sale (POS)
 		- common POS
 	Create orders from online
		- (SMS, facebook page)

 	Inventory view:
		- Store shelf only