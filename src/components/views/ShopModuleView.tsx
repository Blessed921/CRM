import React, { useState } from 'react';
import { useAltivio } from '../../context/AltivioContext';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  RotateCcw, 
  Tag, 
  Plus, 
  Check, 
  CheckCircle2, 
  Send, 
  ExternalLink, 
  AlertCircle,
  Truck,
  DollarSign,
  Copy,
  X
} from 'lucide-react';
import { ShopOrder, ShopProduct } from '../../types/altivio';

interface ShopModuleViewProps {
  initialSubTab?: 'orders' | 'products' | 'customers' | 'abandoned-carts' | 'discounts';
}

export const ShopModuleView: React.FC<ShopModuleViewProps> = ({ initialSubTab = 'orders' }) => {
  const { 
    activeTenant, 
    updateOrderStatus, 
    addProduct 
  } = useAltivio();

  const [subTab, setSubTab] = useState<'orders' | 'products' | 'customers' | 'carts' | 'discounts'>(
    initialSubTab === 'products'
      ? 'products'
      : initialSubTab === 'customers'
      ? 'customers'
      : initialSubTab === 'abandoned-carts'
      ? 'carts'
      : initialSubTab === 'discounts'
      ? 'discounts'
      : 'orders'
  );

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [recoveredCartIds, setRecoveredCartIds] = useState<Record<string, boolean>>({});

  // Product form states
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(120);
  const [prodStock, setProdStock] = useState<number>(25);
  const [prodCategory, setProdCategory] = useState('Home & Decor');

  const shopData = activeTenant.shopData || {
    orders: [],
    products: [],
    customers: [],
    abandonedCarts: [],
    discounts: [],
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const sku = prodSku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const status: ShopProduct['status'] = prodStock <= 0 ? 'out-of-stock' : prodStock < 5 ? 'low-stock' : 'in-stock';

    addProduct(activeTenant.id, {
      name: prodName.trim(),
      sku,
      price: Number(prodPrice) || 50,
      stock: Number(prodStock) || 1,
      category: prodCategory,
      status,
    });

    setProdName('');
    setProdSku('');
    setProdPrice(120);
    setProdStock(25);
    setIsAddProductOpen(false);
  };

  const handleSendRecovery = (cartId: string) => {
    setRecoveredCartIds((prev) => ({ ...prev, [cartId]: true }));
  };

  const copyDiscount = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Sub Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              Shop Engine
            </span>
            <span className="text-slate-400 text-xs">E-Commerce & Store Operations</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1 font-display">
            Storefront Sales & Fulfillment
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your store orders, live inventory, customers, and checkout revenue.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {subTab === 'products' && (
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs strip */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 w-fit">
        <button
          onClick={() => setSubTab('orders')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            subTab === 'orders'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5 text-indigo-400" />
          <span>Orders</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-300">
            {shopData.orders.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('products')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            subTab === 'products'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-indigo-400" />
          <span>Products</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-300">
            {shopData.products.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('customers')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            subTab === 'customers'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Customers</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-300">
            {shopData.customers.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('carts')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            subTab === 'carts'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Abandoned Carts</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-amber-300">
            {shopData.abandonedCarts.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('discounts')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            subTab === 'discounts'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Discounts</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-300">
            {shopData.discounts.length}
          </span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: ORDERS */}
      {/* ------------------------------------------------------------------ */}
      {subTab === 'orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Total Store Orders</span>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {shopData.orders.length}
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 inline-block">All orders paid & confirmed</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Unfulfilled Shipments</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {shopData.orders.filter((o) => o.fulfillmentStatus === 'unfulfilled').length}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 inline-block">Awaiting dispatch</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Orders Gross Value</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                ${shopData.orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 inline-block">From website checkout</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Recent Store Orders
              </h3>
              <span className="text-xs text-slate-400">
                Real-time checkout events
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                    <th className="py-3 px-4 font-medium">Order</th>
                    <th className="py-3 px-4 font-medium">Customer</th>
                    <th className="py-3 px-4 font-medium">Items Summary</th>
                    <th className="py-3 px-4 font-medium">Destination</th>
                    <th className="py-3 px-4 font-medium">Total</th>
                    <th className="py-3 px-4 font-medium">Fulfillment Status</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {shopData.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-white">
                        {order.orderNumber}
                        <div className="text-[10px] text-slate-400 font-normal">{order.createdAt}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {order.itemsSummary}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {order.shippingCity}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                        ${order.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {order.fulfillmentStatus === 'fulfilled' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                            <CheckCircle2 className="w-3 h-3" />
                            Fulfilled
                          </span>
                        )}
                        {order.fulfillmentStatus === 'shipping' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                            <Truck className="w-3 h-3" />
                            In Transit
                          </span>
                        )}
                        {order.fulfillmentStatus === 'unfulfilled' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                            <AlertCircle className="w-3 h-3" />
                            Unfulfilled
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {order.fulfillmentStatus === 'unfulfilled' && (
                          <button
                            onClick={() => updateOrderStatus(activeTenant.id, order.id, 'shipping')}
                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium rounded transition-colors"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {order.fulfillmentStatus === 'shipping' && (
                          <button
                            onClick={() => updateOrderStatus(activeTenant.id, order.id, 'fulfilled')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium rounded transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.fulfillmentStatus === 'fulfilled' && (
                          <span className="text-[11px] text-slate-500 font-mono">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: PRODUCTS */}
      {/* ------------------------------------------------------------------ */}
      {subTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Store Catalog & Stock Levels
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Synchronized with website product showcase and checkout inventory
                </p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                    <th className="py-3 px-4 font-medium">Product Name</th>
                    <th className="py-3 px-4 font-medium">SKU</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Price</th>
                    <th className="py-3 px-4 font-medium">Inventory</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Total Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {shopData.products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-medium text-white">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {p.category}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-200">
                        {p.stock} units
                      </td>
                      <td className="py-3 px-4">
                        {p.status === 'in-stock' && (
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                            In Stock
                          </span>
                        )}
                        {p.status === 'low-stock' && (
                          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                            Low Stock
                          </span>
                        )}
                        {p.status === 'out-of-stock' && (
                          <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/50">
                            Sold Out
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-300 tabular-nums">
                        {p.totalSold} sold
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: CUSTOMERS & LTV */}
      {/* ------------------------------------------------------------------ */}
      {subTab === 'customers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Customer Directory</span>
              <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                {shopData.customers.length}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 inline-block">Registered buyers from website</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Average Customer LTV</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                ${Math.round(
                  shopData.customers.reduce((sum, c) => sum + c.totalSpent, 0) /
                    Math.max(1, shopData.customers.length)
                ).toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 inline-block">Lifetime purchase value</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">VIP / Repeat Buyers</span>
              <div className="text-2xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
                {shopData.customers.filter((c) => c.segment !== 'First-time').length}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 inline-block">Multiple orders placed</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Customer Base & Lifetime Value
              </h3>
              <span className="text-xs text-slate-400">Attributed directly to website store</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                    <th className="py-3 px-4 font-medium">Customer</th>
                    <th className="py-3 px-4 font-medium">Segment</th>
                    <th className="py-3 px-4 font-medium">Orders Count</th>
                    <th className="py-3 px-4 font-medium">Lifetime Spend</th>
                    <th className="py-3 px-4 font-medium text-right">Last Purchase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {shopData.customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                            c.segment === 'VIP Customer'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                              : c.segment === 'Repeat Buyer'
                              ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/50'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {c.segment}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-200">
                        {c.ordersCount} orders
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                        ${c.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {c.lastOrderDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 4: ABANDONED CARTS */}
      {/* ------------------------------------------------------------------ */}
      {subTab === 'carts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-300">
                  Automated Cart Recovery Engine
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Visitors who entered checkout but dropped off before paying. Trigger automated 1-click recovery emails with customized checkout resumption links.
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-400">Potential Recoverable Revenue</div>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                ${shopData.abandonedCarts.reduce((sum, c) => sum + c.cartValue, 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Active Abandoned Checkouts
              </h3>
              <span className="text-xs text-slate-400">
                {shopData.abandonedCarts.length} carts detected in last 48 hours
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                    <th className="py-3 px-4 font-medium">Customer Email</th>
                    <th className="py-3 px-4 font-medium">Items in Cart</th>
                    <th className="py-3 px-4 font-medium">Cart Total</th>
                    <th className="py-3 px-4 font-medium">Abandoned At</th>
                    <th className="py-3 px-4 font-medium">Recovery Status</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {shopData.abandonedCarts.map((cart) => {
                    const sent = recoveredCartIds[cart.id] || cart.emailRecoverySent;
                    return (
                      <tr key={cart.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-white">
                          {cart.customerEmail}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {cart.itemsCount} items
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-400 tabular-nums">
                          ${cart.cartValue.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {cart.abandonedAt}
                        </td>
                        <td className="py-3 px-4">
                          {sent ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                              <Check className="w-3 h-3" />
                              Recovery Email Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              Pending Follow-up
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleSendRecovery(cart.id)}
                            disabled={sent}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors flex items-center gap-1 ml-auto ${
                              sent
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                          >
                            <Send className="w-3 h-3" />
                            <span>{sent ? 'Sent' : 'Send Recovery Email'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 5: DISCOUNTS & PROMOS */}
      {/* ------------------------------------------------------------------ */}
      {subTab === 'discounts' && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Website Coupon & Promotion Codes
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Track redemption rates and attribution from social campaigns
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                    <th className="py-3 px-4 font-medium">Coupon Code</th>
                    <th className="py-3 px-4 font-medium">Discount Value</th>
                    <th className="py-3 px-4 font-medium">Usage Count</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {shopData.discounts.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white bg-slate-950 px-2 py-1 rounded border border-slate-800">
                            {d.code}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {d.discountType === 'percentage' ? `${d.value}% OFF` : `$${d.value} OFF`}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-300">
                        {d.usageCount} / {d.usageLimit} redemptions
                      </td>
                      <td className="py-3 px-4">
                        {d.status === 'active' ? (
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                            Active
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            Expired
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => copyDiscount(d.code)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-flex items-center gap-1"
                        >
                          {copiedCode === d.code ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white font-display">
              Add Store Product
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add an item to {activeTenant.name}'s live store catalog.
            </p>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handcrafted Ceramic Vase"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KOV-CER-04"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ceramics"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Publish to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
