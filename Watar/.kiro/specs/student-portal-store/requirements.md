# Requirements Document

## Introduction

The Student Portal Store is a physical product marketplace within the Wattar Academy student portal. Students can browse and purchase real products such as instruments, accessories (strings, picks, capos), music books, and academy merchandise. The store integrates with the existing student portal authentication and provides admin/manager capabilities for product and order management.

## Glossary

- **Store**: The product marketplace section within the student portal where students browse and purchase physical products
- **Product**: A physical item available for purchase in the Store (instruments, accessories, books, merchandise)
- **Cart**: A temporary collection of products a student intends to purchase before placing an order
- **Order**: A confirmed purchase request from a student containing one or more products with quantities
- **Order_Status**: The lifecycle state of an order: pending, confirmed, shipped, delivered, or cancelled
- **Stock**: The available quantity of a specific product
- **Product_Manager**: A user with the manager role who administers store products and orders
- **Student_Buyer**: An authenticated student portal user who browses products and places orders
- **Product_Category**: A classification grouping for products (instruments, accessories, books, merchandise)

## Requirements

### Requirement 1: Product Catalog Browsing

**User Story:** As a student, I want to browse available products in the store, so that I can find items I want to purchase.

#### Acceptance Criteria

1. WHEN a Student_Buyer navigates to the Store page, THE Store SHALL display all active products with their name, image, price, and stock availability
2. WHEN a Student_Buyer selects a Product_Category filter, THE Store SHALL display only products belonging to that category
3. WHEN a Student_Buyer views a product detail page, THE Store SHALL display the product name, description, price, images, category, and current stock status
4. WHILE a product has zero Stock, THE Store SHALL display that product as "Out of Stock" and disable the add-to-cart action for that product
5. THE Store SHALL display products sorted by creation date with newest products first by default

### Requirement 2: Shopping Cart

**User Story:** As a student, I want to add products to a cart and adjust quantities, so that I can prepare my order before purchasing.

#### Acceptance Criteria

1. WHEN a Student_Buyer clicks "Add to Cart" on a product, THE Cart SHALL add that product with a quantity of one
2. WHEN a Student_Buyer increases the quantity of a Cart item beyond available Stock, THE Cart SHALL restrict the quantity to the available Stock amount
3. WHEN a Student_Buyer removes an item from the Cart, THE Cart SHALL remove that product and update the total price
4. THE Cart SHALL display the total price as the sum of each item price multiplied by its quantity
5. WHEN a Student_Buyer has an empty Cart and navigates to the Cart page, THE Cart SHALL display a message indicating the cart is empty
6. THE Cart SHALL persist across page navigations within the same session

### Requirement 3: Order Placement

**User Story:** As a student, I want to place an order for the items in my cart, so that I can purchase the products I need.

#### Acceptance Criteria

1. WHEN a Student_Buyer confirms an order, THE Store SHALL create an Order with status "pending" containing all Cart items with their quantities
2. WHEN a Student_Buyer confirms an order, THE Store SHALL reduce the Stock of each ordered product by the ordered quantity
3. WHEN a Student_Buyer confirms an order, THE Store SHALL clear the Cart
4. IF a product's Stock becomes insufficient between adding to Cart and order confirmation, THEN THE Store SHALL reject the order and notify the Student_Buyer of the unavailable items
5. WHEN an Order is created, THE Store SHALL record the student ID, order date, total amount, and delivery notes provided by the student
6. THE Store SHALL require at least one item in the Cart before allowing order placement

### Requirement 4: Order History and Tracking

**User Story:** As a student, I want to view my past orders and their status, so that I can track my purchases.

#### Acceptance Criteria

1. WHEN a Student_Buyer navigates to the order history page, THE Store SHALL display all orders placed by that student sorted by date descending
2. THE Store SHALL display each order with its order date, total amount, items list, and current Order_Status
3. WHEN an Order_Status changes, THE Store SHALL reflect the updated status on the student's order history page

### Requirement 5: Admin Product Management

**User Story:** As a manager, I want to add, edit, and delete products, so that I can manage the store inventory.

#### Acceptance Criteria

1. WHEN a Product_Manager adds a new product, THE Store SHALL save the product with name, description, price, category, stock quantity, and at least one image
2. WHEN a Product_Manager edits a product, THE Store SHALL update the product details and retain the existing images unless new ones are uploaded
3. WHEN a Product_Manager deletes a product that has no associated pending or confirmed orders, THE Store SHALL remove the product from the catalog
4. IF a Product_Manager attempts to delete a product that has pending or confirmed orders, THEN THE Store SHALL reject the deletion and display a warning message
5. WHEN a Product_Manager uploads a product image, THE Store SHALL validate that the file is a valid image format (JPG, PNG, or WebP) and does not exceed 2MB
6. THE Store SHALL allow a Product_Manager to set a product as inactive without deleting it, hiding it from the student catalog

### Requirement 6: Admin Order Management

**User Story:** As a manager, I want to view and update order statuses, so that I can fulfill student purchases.

#### Acceptance Criteria

1. WHEN a Product_Manager views the orders dashboard, THE Store SHALL display all orders with student name, order date, total amount, items, and current Order_Status
2. WHEN a Product_Manager updates an Order_Status to "confirmed", THE Store SHALL record the confirmation date and the manager who confirmed it
3. WHEN a Product_Manager updates an Order_Status to "delivered", THE Store SHALL record the delivery date
4. WHEN a Product_Manager cancels an Order, THE Store SHALL restore the Stock quantities for all items in that order
5. THE Store SHALL allow filtering orders by Order_Status
6. IF a Product_Manager changes an Order_Status from "delivered" back to a previous state, THEN THE Store SHALL reject the status change

### Requirement 7: Stock Management

**User Story:** As a manager, I want to manage product stock levels, so that students see accurate availability.

#### Acceptance Criteria

1. WHEN a Product_Manager updates the Stock for a product, THE Store SHALL save the new quantity and reflect it immediately in the student catalog
2. WHILE a product Stock reaches zero, THE Store SHALL mark the product as "Out of Stock" in the catalog
3. WHEN a product Stock is replenished from zero, THE Store SHALL restore the product to purchasable status in the catalog

### Requirement 8: Store Navigation Integration

**User Story:** As a student, I want to access the store from my portal dashboard, so that I can easily find and navigate to the store.

#### Acceptance Criteria

1. THE Store SHALL be accessible via a navigation link in the student portal sidebar or navigation bar
2. WHEN a Student_Buyer is not authenticated, THE Store SHALL redirect to the portal login page
3. THE Store SHALL display a cart icon with the current number of items in the navigation area
