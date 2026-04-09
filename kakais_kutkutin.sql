-- Updated database schema for enhanced tracking and forecasting capabilities.

-- New Tables:
CREATE TABLE product_variants (
    id INT PRIMARY KEY,
    product_id INT,
    variant_name VARCHAR(255),
    variant_value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE composite_recipes (
    id INT PRIMARY KEY,
    recipe_name VARCHAR(255),
    ingredients TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE damage_loss_entries (
    id INT PRIMARY KEY,
    product_id INT,
    quantity_damaged INT,
    date_reported TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE back_orders (
    id INT PRIMARY KEY,
    product_id INT,
    order_quantity INT,
    order_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE purchase_orders (
    id INT PRIMARY KEY,
    supplier_id INT,
    order_date TIMESTAMP,
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE inventory_forecasts (
    id INT PRIMARY KEY,
    product_id INT,
    forecast_quantity INT,
    forecast_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE kpi_metrics (
    id INT PRIMARY KEY,
    metric_name VARCHAR(255),
    value DECIMAL(10, 2),
    recorded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sales_analytics (
    id INT PRIMARY KEY,
    product_id INT,
    sales_date TIMESTAMP,
    sales_quantity INT,
    total_sales DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payment_method_tracking (
    id INT PRIMARY KEY,
    payment_method VARCHAR(255),
    user_id INT,
    amount DECIMAL(10, 2),
    transaction_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
    id INT PRIMARY KEY,
    alert_type VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- New Columns:
ALTER TABLE some_existing_table ADD COLUMN variant_support BOOLEAN;
ALTER TABLE some_existing_table ADD COLUMN composite_items BOOLEAN;
ALTER TABLE some_existing_table ADD COLUMN transaction_voiding BOOLEAN;
ALTER TABLE some_existing_table ADD COLUMN payment_tracking BOOLEAN;
ALTER TABLE some_existing_table ADD COLUMN forecasting_capabilities BOOLEAN;