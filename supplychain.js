/**
 * SupplyChain.AI — Unified Enterprise Client Engine
 * Handles state management, real-time cross-module workflows,
 * dynamic search/filtering, modals, notifications, and AI Copilot.
 */

(function () {
  'use strict';

  // --- 1. DEFAULT DATA INITIALIZATION ---
  const DEFAULT_STATE = {
    user: {
      name: 'Alexander Vance',
      role: 'VP of Global Logistics',
      email: 'vvijwal01@gmail.com',
      phone: '+91 98765 43210',
      dept: 'Global Autonomous Supply Logistics (ORD-3)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authenticated: true
    },
    kpi: {
      todayOrders: 1248,
      todayOrdersChange: '+14.2%',
      costSavings: '₹1.42M',
      savingsChange: '+8.4%',
      globalOtif: '98.2%',
      otifChange: '+1.8%',
      stockoutRisk: 'Low (2.1%)',
      activeAirShipments: 42,
      activeOceanShipments: 128,
      activeTruckShipments: 310
    },
    orders: [
      {
        id: 'ORD-8942',
        item: 'Fresh Organic Whole Milk (1 Gallon)',
        sku: 'SKU-MILK-101',
        supplier: 'GreenField Dairy Farms',
        origin: 'Shenzhen Cold Chain Hub',
        destination: 'Chicago Distribution Hub (ORD-3)',
        carrier: 'ColdExpress Refrigerated Logistics',
        status: 'In Transit',
        statusColor: 'tertiary',
        eta: 'Oct 24, 2026',
        progress: 68,
        value: '₹34,800',
        priority: 'High',
        timeline: [
          { time: 'Oct 12, 08:30', title: 'Farm Dispatch', desc: 'Loaded into temperature-controlled container #DAIRY-9921', done: true },
          { time: 'Oct 14, 14:15', title: 'Cold Chain Quality Inspection Passed', desc: 'FDA & INRA compliance passed', done: true },
          { time: 'Oct 18, 03:00', title: 'Interstate Refrigerated Transit', desc: 'Refrigerated convoy on schedule', done: true },
          { time: 'Oct 22, 11:00', title: 'Regional Distribution Hub Arrival', desc: 'Berthing scheduled at Cold Dock 4', done: false },
          { time: 'Oct 24, 18:00', title: 'Supermarket Final Delivery', desc: 'Final mile delivery to Chicago stores', done: false }
        ]
      },
      {
        id: 'ORD-8941',
        item: 'Whole Wheat Bread Loaves (Pack of 12)',
        sku: 'SKU-BREAD-202',
        supplier: 'Nordic Bakery & Flour Co.',
        origin: 'Oslo Bakery Hub, NO',
        destination: 'Rotterdam Supermarket Terminal',
        carrier: 'DHL Fresh Logistics',
        status: 'Delivered',
        statusColor: 'primary',
        eta: 'Oct 19, 2026',
        progress: 100,
        value: '₹14,500',
        priority: 'Medium',
        timeline: [
          { time: 'Oct 15, 09:00', title: 'Dispatched from Oslo Bakery', desc: 'Fresh batch baked and manifest filed', done: true },
          { time: 'Oct 17, 16:00', title: 'Cross-Border Fresh Transit', desc: 'Crossed to Netherlands corridor', done: true },
          { time: 'Oct 19, 10:45', title: 'Signed & Delivered at Rotterdam Depot', desc: 'Receiver accepted with 0 fresh defects', done: true }
        ]
      },
      {
        id: 'ORD-8939',
        item: 'Fresh Hass Avocados (Box of 24)',
        sku: 'SKU-AVO-303',
        supplier: 'Apex Organic Produce',
        origin: 'Hsinchu Farms, TW',
        destination: 'Munich Fresh Facility',
        carrier: 'AirFresh Express Cargo',
        status: 'Customs Hold',
        statusColor: 'error',
        eta: 'Oct 21, 2026',
        progress: 45,
        value: '₹58,000',
        priority: 'Critical',
        timeline: [
          { time: 'Oct 16, 06:00', title: 'Harvested & Air-Shipped', desc: 'Departed Taoyuan Cargo Air', done: true },
          { time: 'Oct 17, 22:30', title: 'Frankfurt Airport Agricultural Clearance', desc: 'Held for organic phytosanitary inspection', done: true },
          { time: 'Oct 20, Pending', title: 'AI Expedited Clearance Filing', desc: 'Autonomous filing of EU organic certificate', done: false },
          { time: 'Oct 21, Scheduled', title: 'Final Temperature Van Delivery', desc: 'Direct delivery to Munich distribution center', done: false }
        ]
      },
      {
        id: 'ORD-8935',
        item: 'Farm Fresh Organic Eggs (Grade A 12-Pack)',
        sku: 'SKU-EGG-404',
        supplier: 'Katanga Poultry Farms',
        origin: 'Kolwezi Organic Ranch',
        destination: 'Austin Supermarket Distribution',
        carrier: 'Hapag-Lloyd Cold Shipping',
        status: 'In Transit',
        statusColor: 'tertiary',
        eta: 'Nov 02, 2026',
        progress: 35,
        value: '₹89,000',
        priority: 'High',
        timeline: [
          { time: 'Oct 08, 10:00', title: 'Farm Gate Inspection Passed', desc: 'Certified cage-free organic stamp', done: true },
          { time: 'Oct 13, 19:20', title: 'Loaded on Cold Vessel Durban', desc: 'Cold storage hold set to 3.5C', done: true },
          { time: 'Oct 28, Expected', title: 'Arrival Port of Houston', desc: 'Offloading at Bayport Fresh Terminal', done: false },
          { time: 'Nov 02, Expected', title: 'Arrival Austin Distribution', desc: 'Refrigerated truck convoy', done: false }
        ]
      },
      {
        id: 'ORD-8930',
        item: 'Extra Virgin Olive Oil (1L Bottle)',
        sku: 'SKU-OIL-505',
        supplier: 'Nippon Organics & Foodware',
        origin: 'Yokohama Olive Orchards, JP',
        destination: 'Seattle Grocery Center',
        carrier: 'Nippon Express Air Cargo',
        status: 'In Transit',
        statusColor: 'tertiary',
        eta: 'Oct 23, 2026',
        progress: 82,
        value: '₹41,200',
        priority: 'Medium',
        timeline: [
          { time: 'Oct 17, 11:30', title: 'Bottled & Picked up Yokohama', desc: 'Glass protection packing', done: true },
          { time: 'Oct 18, 20:00', title: 'Tokyo Narita Air Freight Departed', desc: 'Flight JL-6002', done: true },
          { time: 'Oct 19, 14:00', title: 'Cleared US FDA Customs SEA-TAC', desc: 'Food import clearance approved', done: true },
          { time: 'Oct 23, Scheduled', title: 'Final Retail Docking', desc: 'Scheduled delivery window 09:00 - 12:00', done: false }
        ]
      }
    ],
    inventory: [
      {
        sku: 'SKU-MILK-101',
        name: 'Fresh Organic Whole Milk (1 Gallon)',
        category: 'Dairy & Refrigerated',
        warehouse: 'Chicago Cold Hub (ORD-3)',
        onHand: 1420,
        minSafety: 1200,
        incoming: 500,
        unitCost: '₹4.50',
        turnover: '52.4x/yr',
        status: 'Optimal',
        statusColor: 'tertiary'
      },
      {
        sku: 'SKU-AVO-303',
        name: 'Fresh Hass Avocados (Box of 24)',
        category: 'Fresh Produce',
        warehouse: 'Munich Fresh Facility',
        onHand: 180,
        minSafety: 350,
        incoming: 400,
        unitCost: '₹28.00',
        turnover: '48.2x/yr',
        status: 'Critical Low',
        statusColor: 'error'
      },
      {
        sku: 'SKU-EGG-404',
        name: 'Farm Fresh Organic Eggs (Grade A 12-Pack)',
        category: 'Dairy & Poultry',
        warehouse: 'Austin Farm Hub',
        onHand: 4200,
        minSafety: 3000,
        incoming: 2000,
        unitCost: '₹4.80',
        turnover: '60.8x/yr',
        status: 'Optimal',
        statusColor: 'tertiary'
      },
      {
        sku: 'SKU-BREAD-202',
        name: 'Whole Wheat Bread Loaves (Pack of 12)',
        category: 'Bakery',
        warehouse: 'Rotterdam Bakery Depot',
        onHand: 840,
        minSafety: 800,
        incoming: 1200,
        unitCost: '₹3.20',
        turnover: '74.1x/yr',
        status: 'Warning',
        statusColor: 'primary-container'
      },
      {
        sku: 'SKU-OIL-505',
        name: 'Extra Virgin Olive Oil (1L Bottle)',
        category: 'Pantry Staples',
        warehouse: 'Seattle Grocery Center',
        onHand: 310,
        minSafety: 250,
        incoming: 150,
        unitCost: '₹14.50',
        turnover: '18.4x/yr',
        status: 'Optimal',
        statusColor: 'tertiary'
      },
      {
        sku: 'SKU-BAN-606',
        name: 'Organic Cavendish Bananas (Box of 40)',
        category: 'Fresh Produce',
        warehouse: 'Tokyo Fresh Hub',
        onHand: 620,
        minSafety: 900,
        incoming: 0,
        unitCost: '₹18.00',
        turnover: '65.9x/yr',
        status: 'Warning',
        statusColor: 'primary-container'
      }
    ],
    suppliers: [
      {
        id: 'SUP-01',
        name: 'GreenField Dairy Farms',
        location: 'Shenzhen, CN',
        category: 'Dairy & Produce',
        vetted: true,
        otif: '99.4%',
        defectRate: '0.012%',
        trustScore: 98,
        activeContracts: 4,
        leadTimeDays: 3,
        avatar: 'factory'
      },
      {
        id: 'SUP-02',
        name: 'Nordic Bakery & Flour Co.',
        location: 'Oslo, NO',
        category: 'Bakery & Grains',
        vetted: true,
        otif: '98.1%',
        defectRate: '0.005%',
        trustScore: 96,
        activeContracts: 2,
        leadTimeDays: 2,
        avatar: 'inventory_2'
      },
      {
        id: 'SUP-03',
        name: 'Apex Organic Produce',
        location: 'Hsinchu, TW',
        category: 'Fresh Fruits & Veggies',
        vetted: true,
        otif: '96.8%',
        defectRate: '0.024%',
        trustScore: 94,
        activeContracts: 6,
        leadTimeDays: 4,
        avatar: 'memory'
      },
      {
        id: 'SUP-04',
        name: 'Katanga Poultry Farms',
        location: 'Kolwezi, CD',
        category: 'Poultry & Dairy',
        vetted: true,
        otif: '94.2%',
        defectRate: '0.040%',
        trustScore: 91,
        activeContracts: 3,
        leadTimeDays: 5,
        avatar: 'shield'
      },
      {
        id: 'SUP-05',
        name: 'Nippon Organics & Foodware',
        location: 'Yokohama, JP',
        category: 'Pantry & Oils',
        vetted: true,
        otif: '99.8%',
        defectRate: '0.001%',
        trustScore: 99,
        activeContracts: 5,
        leadTimeDays: 3,
        avatar: 'precision_manufacturing'
      }
    ],
    approvals: [
      {
        id: 'APV-401',
        poNumber: 'PO-2026-9921',
        sku: 'SKU-AVO-303',
        item: 'Fresh Hass Avocados (Box of 24)',
        qty: 600,
        totalCost: '₹16,800',
        unitPrice: '₹28.00',
        supplier: 'Apex Organic Produce',
        urgency: 'Critical',
        status: 'Pending Authorization',
        reason: 'Predicted +48% weekend grocery shopping demand surge across European supermarket chains',
        financialImpact: 'Prevents estimated ₹420,000 spoilage & stockout loss at Munich facility',
        confidenceScore: '99.4%',


        quotes: [
          { vendor: 'Apex Precision (Preferred)', price: '₹1,450/unit', leadTime: '12 Days', reliability: '99.2%', selected: true },
          { vendor: 'GlobalSilicon EU', price: '₹1,620/unit', leadTime: '18 Days', reliability: '94.0%', selected: false },
          { vendor: 'Eastern Micro Foundry', price: '₹1,380/unit', leadTime: '35 Days', reliability: '89.5%', selected: false }
        ]
      }
    ],
    aiRecommendations: [
      {
        id: 'REC-101',
        title: 'Autonomous Restock: Expedite Fresh Hass Avocados',
        category: 'Perishable Cold Chain Intelligence',
        sku: 'SKU-AVO-303',
        recommendedQty: 600,
        confidence: '99.4%',
        urgency: 'Immediate',
        summary: 'European retail telemetry detects +48% weekend grocery shopping demand surge. Munich regional fresh facility buffer will be exhausted in 3 days.',
        purchasePattern: {
          ordersCount: '14 POs (Past 90 Days)',
          avgCycleDays: '6.2 Days Avg Reorder',
          sellThroughRate: '98.6% within 72h of receipt',
          historicalUnitPrice: '₹28.00/box',
          historicalMargin: '+23.4% Gross Margin'
        },
        financialOutcome: 'PROFIT',
        projectedProfitLoss: '+₹42,800 Net Profit (+27.6% ROI)',
        profitOrLossLabel: 'Projected Net Profit',
        financialReasoning: 'Historical purchase patterns prove fast retail turnover. Replenishing now captures ₹64,800 gross sales against ₹22,000 procurement & freight costs.',
        vendors: {
          incumbent: {
            id: 'incumbent',
            name: 'Pacific Coast Harvest',
            price: '₹28.00 / box',
            unitCostNum: 28.00,
            totalCost: '₹16,800',
            leadTime: '5 Days',
            otif: '94.2%',
            defectRate: '0.04%',
            trustScore: 88,
            projectedProfit: '+₹38,400 Profit',
            description: 'Incumbent supplier from previous 14 purchase orders. Stable fulfillment with standard lead times.'
          },
          popularTrusted: {
            id: 'popularTrusted',
            name: 'Apex Organic Produce',
            price: '₹26.20 / box',
            unitCostNum: 26.20,
            totalCost: '₹15,720',
            leadTime: '3 Days',
            otif: '99.4%',
            defectRate: '0.008%',
            trustScore: 98,
            badge: '🔥 Top Rated & Popular',
            projectedProfit: '+₹42,800 Profit (+₹4,400 Higher)',
            savingsVsIncumbent: 'Save ₹1,080 on PO + 2 Days Faster',
            description: 'Tier-1 Certified organic supplier with 99.4% OTIF compliance and expedited temperature-controlled transit.'
          }
        },
        selectedVendorKey: 'popularTrusted'
      },
      {
        id: 'REC-102',
        title: 'High-Velocity Restock: Organic Whole Milk 1 Gallon',
        category: 'High-Turnover Dairy Logistics',
        sku: 'SKU-MILK-101',
        recommendedQty: 1200,
        confidence: '98.8%',
        urgency: 'High',
        summary: 'Chicago central distribution cold vault depleted to 42% minimum threshold ahead of high-volume supermarket weekend stocking wave.',
        purchasePattern: {
          ordersCount: '28 POs (Past 60 Days)',
          avgCycleDays: '2.1 Days Velocity',
          sellThroughRate: '99.2% Turnover (14.2x/yr)',
          historicalUnitPrice: '₹24.50/case',
          historicalMargin: '+31.8% Gross Margin'
        },
        financialOutcome: 'PROFIT',
        projectedProfitLoss: '+₹31,200 Net Profit (+34.2% ROI)',
        profitOrLossLabel: 'Projected Net Profit',
        financialReasoning: 'Consistent high turnover pattern ensures zero spoilage. Fast delivery cycle directly shields Midwest supermarkets from stockout penalties.',
        vendors: {
          incumbent: {
            id: 'incumbent',
            name: 'GreenField Dairy Farms',
            price: '₹24.50 / case',
            unitCostNum: 24.50,
            totalCost: '₹29,400',
            leadTime: '4 Days',
            otif: '98.2%',
            defectRate: '0.015%',
            trustScore: 92,
            projectedProfit: '+₹29,800 Profit',
            description: 'Current contract dairy partner. Reliable historical OTIF with 4-day cold dispatch.'
          },
          popularTrusted: {
            id: 'popularTrusted',
            name: 'Nordic Cold Chain Direct',
            price: '₹23.10 / case',
            unitCostNum: 23.10,
            totalCost: '₹27,720',
            leadTime: '2 Days',
            otif: '99.8%',
            defectRate: '0.004%',
            trustScore: 99,
            badge: '⭐ Preferred Partner & Fastest',
            projectedProfit: '+₹31,200 Profit (+₹1,400 Higher)',
            savingsVsIncumbent: 'Save ₹1,680 on PO + 2 Days Faster',
            description: 'Direct dairy cooperative network with 99.8% precision temperature tracking and 48-hour delivery.'
          }
        },
        selectedVendorKey: 'popularTrusted'
      },
      {
        id: 'REC-103',
        title: 'Supplier Risk Mitigation: Extra Virgin Olive Oil 1L',
        category: 'Import Bottleneck & Loss Shield',
        sku: 'SKU-OIL-505',
        recommendedQty: 800,
        confidence: '97.2%',
        urgency: 'Medium',
        summary: 'Historical shipments through previous sea routes faced port congestion & demurrage penalties. Re-sourcing prevents ₹14,500 in holding losses.',
        purchasePattern: {
          ordersCount: '6 POs (Past 120 Days)',
          avgCycleDays: '20.0 Days Lead Time',
          sellThroughRate: '89.0% Sales Conversion',
          historicalUnitPrice: '₹38.00/bottle',
          historicalMargin: '+16.2% Gross Margin'
        },
        financialOutcome: 'LOSS_RISK',
        projectedProfitLoss: '-₹14,500 Potential Loss Avoidance',
        profitOrLossLabel: 'Risk & Loss Prevention',
        financialReasoning: 'Previous purchase orders incurred ₹4,200 in port storage fees and ₹10,300 in delayed-stock retail penalties. Switching vendors shields enterprise margins.',
        vendors: {
          incumbent: {
            id: 'incumbent',
            name: 'Mediterranean Harvest Exports',
            price: '₹38.00 / bottle',
            unitCostNum: 38.00,
            totalCost: '₹30,400',
            leadTime: '24 Days',
            otif: '88.5%',
            defectRate: '0.08%',
            trustScore: 79,
            projectedProfit: '-₹14,500 Risk Exposure',
            description: 'Incumbent overseas vendor. Prone to customs bottlenecks and high demurrage charges.'
          },
          popularTrusted: {
            id: 'popularTrusted',
            name: 'Apex Precision Logistics & Food',
            price: '₹34.50 / bottle',
            unitCostNum: 34.50,
            totalCost: '₹27,600',
            leadTime: '6 Days',
            otif: '99.1%',
            defectRate: '0.01%',
            trustScore: 97,
            badge: '🏆 High Reliability Trusted Vendor',
            projectedProfit: '+₹18,600 Net Gain (Eliminates Losses)',
            savingsVsIncumbent: 'Save ₹2,800 + Avoid ₹14.5K Penalty',
            description: 'Pre-cleared domestic bonded warehouse inventory with 6-day guaranteed truckload dispatch.'
          }
        },
        selectedVendorKey: 'popularTrusted'
      }
    ],
    notifications: [
      { id: 'NOTIF-1', title: 'Autonomous Action: PO-2026-9921 generated for Organic Produce', time: '10m ago', read: false, type: 'ai' },
      { id: 'NOTIF-2', title: 'Cold chain inspection cleared for ORD-8942 Fresh Milk', time: '42m ago', read: false, type: 'transit' },
      { id: 'NOTIF-3', title: 'Phytosanitary inspection hold on ORD-8939 Avocados at Frankfurt', time: '2h ago', read: false, type: 'alert' }
    ]
  };

  // Force reset localStorage if dataset version updated
  if (localStorage.getItem('sc_dataset_version') !== 'grocery_v9_inr') {
    Object.keys(DEFAULT_STATE).forEach(k => {
      localStorage.removeItem('supplychain_state_' + k);
      localStorage.setItem('supplychain_state_' + k, JSON.stringify(DEFAULT_STATE[k]));
    });
    localStorage.setItem('sc_dataset_version', 'grocery_v9_inr');
  }




  // --- 2. STATE MANAGER ---
  window.SupplyChainState = {
    get: function (key) {
      try {
        const stored = localStorage.getItem('supplychain_state_' + key);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error('State load error:', e);
      }
      return DEFAULT_STATE[key];
    },
    set: function (key, value) {
      try {
        localStorage.setItem('supplychain_state_' + key, JSON.stringify(value));
        window.dispatchEvent(new CustomEvent('supplychain_state_changed', { detail: { key, value } }));
      } catch (e) {
        console.error('State save error:', e);
      }
    },
    resetToDefaults: function () {
      Object.keys(DEFAULT_STATE).forEach(k => {
        localStorage.setItem('supplychain_state_' + k, JSON.stringify(DEFAULT_STATE[k]));
      });
      window.dispatchEvent(new CustomEvent('supplychain_state_changed', { detail: { key: 'all' } }));
    }
  };

  // Initialize state if empty
  Object.keys(DEFAULT_STATE).forEach(k => {
    if (!localStorage.getItem('supplychain_state_' + k)) {
      localStorage.setItem('supplychain_state_' + k, JSON.stringify(DEFAULT_STATE[k]));
    }
  });


  // --- 3. TOAST NOTIFICATION SYSTEM ---
  window.showToast = function (title, message, type = 'success') {
    let container = document.getElementById('sc-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sc-toast-container';
      container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto bg-[#0d1c2d]/95 backdrop-blur-md border border-[#273647] text-[#d4e4fa] p-4 rounded-xl shadow-2xl flex items-start gap-3 transform translate-y-4 opacity-0 transition-all duration-300';
    
    let icon = 'check_circle';
    let iconColor = 'text-[#7bd0ff]';
    if (type === 'error') {
      icon = 'error';
      iconColor = 'text-[#ffb4ab]';
      toast.classList.add('border-[#93000a]');
    } else if (type === 'ai') {
      icon = 'psychology';
      iconColor = 'text-[#ff5c35]';
      toast.classList.add('border-[#ff5c35]/40');
    } else if (type === 'alert') {
      icon = 'warning';
      iconColor = 'text-[#ffb4a3]';
    }

    toast.innerHTML = `
      <span class="material-symbols-outlined ${iconColor} text-2xl shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">${icon}</span>
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-sm text-white">${title}</h4>
        <p class="text-xs text-[#bec6e0] mt-0.5 leading-relaxed">${message}</p>
      </div>
      <button class="text-[#bec6e0] hover:text-white p-1 rounded transition-colors shrink-0" onclick="this.parentElement.remove()">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => {
        if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4500);
  };

  // --- 4. ROUTE MAP ---
  const ROUTE_MAP = {
    login: { clean: 'index.html', legacy: ['supplychain_2_login___supplychain_ai.html', 'supplychain_10_login___supplychain_ai.html'] },
    dashboard: { clean: 'dashboard.html', legacy: ['supplychain_4_dashboard___supplychain_ai.html', 'supplychain_7_dashboard___supplychain_ai.html'] },
    orders: { clean: 'orders.html', legacy: ['supplychain_8_orders___supplychain_ai.html'] },
    inventory: { clean: 'inventory.html', legacy: ['supplychain_3_inventory___supplychain_ai.html', 'supplychain_11_inventory___supplychain_ai.html'] },
    suppliers: { clean: 'suppliers.html', legacy: ['supplychain_14_suppliers___supplychain_ai.html', 'supplychain_15_suppliers___supplychain_ai.html'] },
    ai_insights: { clean: 'ai-insights.html', legacy: ['supplychain_13_ai_recommendation___supplychai.html', 'supplychain_16_ai_recommendation___supplychai.html'] },
    restock_approval: { clean: 'restock-approval.html', legacy: ['supplychain_6_restock_approval___supplychain.html', 'supplychain_17_restock_approval___supplychain.html'] },
    payments: { clean: 'payments.html', legacy: ['supplychain_payment_gateway.html', 'payments'] },
    profile: { clean: 'profile.html', legacy: ['profile'] }
  };


  function getCurrentRouteKey() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    for (const [key, val] of Object.entries(ROUTE_MAP)) {
      if (val.clean === path || val.legacy.includes(path) || window.location.pathname.endsWith('/' + key)) {
        return key;
      }
    }
    if (path === '' || path === '/') return 'login';
    return 'dashboard';
  }

  // --- 5. WORKFLOW ACTIONS ---
  window.SupplyChainActions = {
    selectAiVendor: function (recId, vendorKey) {
      const recs = window.SupplyChainState.get('aiRecommendations') || [];
      const rec = recs.find(r => r.id === recId);
      if (rec) {
        rec.selectedVendorKey = vendorKey;
        window.SupplyChainState.set('aiRecommendations', recs);
        if (typeof window.renderAiInsightsPage === 'function') {
          window.renderAiInsightsPage();
        }
        const v = rec.vendors[vendorKey];
        const vType = vendorKey === 'popularTrusted' ? 'Popular / Trusted Vendor' : 'Same Incumbent Vendor';
        window.showToast('Supplier Selection Updated', `Selected ${vType}: ${v.name} (${v.price}, ${v.leadTime} lead time).`, 'success');
      }
    },

    acceptAiRecommendation: function (recId) {
      const recs = window.SupplyChainState.get('aiRecommendations') || [];
      const rec = recs.find(r => r.id === recId) || recs[0];
      if (!rec) return;

      const vendorKey = rec.selectedVendorKey || 'popularTrusted';
      const selectedVendor = (rec.vendors && rec.vendors[vendorKey]) ? rec.vendors[vendorKey] : {
        name: rec.targetSupplier || 'Apex Organic Produce',
        price: '₹26.20/unit',
        unitCostNum: 26.20,
        leadTime: '3 Days',
        otif: '99.4%',
        trustScore: 98
      };

      const altVendorKey = vendorKey === 'popularTrusted' ? 'incumbent' : 'popularTrusted';
      const altVendor = (rec.vendors && rec.vendors[altVendorKey]) ? rec.vendors[altVendorKey] : null;

      const qty = rec.recommendedQty || 600;
      const unitPriceNum = selectedVendor.unitCostNum || 26.20;
      const totalCostStr = '₹' + (qty * unitPriceNum).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const approvals = window.SupplyChainState.get('approvals') || [];
      const newApv = {
        id: 'APV-' + Math.floor(100 + Math.random() * 900),
        poNumber: 'PO-2026-' + Math.floor(1000 + Math.random() * 9000),
        sku: rec.sku,
        item: rec.title.replace('Autonomous Restock: ', '').replace('High-Velocity Restock: ', '').replace('Supplier Risk Mitigation: ', ''),
        qty: qty,
        totalCost: totalCostStr,
        unitPrice: selectedVendor.price || ('₹' + unitPriceNum.toFixed(2)),
        supplier: selectedVendor.name,
        urgency: rec.urgency || 'Critical',
        status: 'Pending Authorization',
        reason: `${rec.summary} [Previous Purchase Pattern Analyzed: ${rec.purchasePattern?.ordersCount || 'Historical'} | ${rec.financialOutcome === 'PROFIT' ? '🟢 Projected Profit: ' + rec.projectedProfitLoss : '🔴 Risk Avoidance: ' + rec.projectedProfitLoss}]`,
        financialImpact: rec.projectedProfitLoss,
        confidenceScore: rec.confidence,
        quotes: [
          {
            vendor: selectedVendor.name + (vendorKey === 'popularTrusted' ? ' (Popular / Trusted Choice)' : ' (Incumbent Supplier)'),
            price: selectedVendor.price,
            leadTime: selectedVendor.leadTime,
            reliability: selectedVendor.otif,
            selected: true
          }
        ]
      };

      if (altVendor) {
        newApv.quotes.push({
          vendor: altVendor.name + (altVendorKey === 'popularTrusted' ? ' (Popular / Trusted Alternate)' : ' (Incumbent Alternate)'),
          price: altVendor.price,
          leadTime: altVendor.leadTime,
          reliability: altVendor.otif,
          selected: false
        });
      }

      approvals.unshift(newApv);
      window.SupplyChainState.set('approvals', approvals);

      const notifs = window.SupplyChainState.get('notifications') || [];
      notifs.unshift({
        id: 'NOTIF-' + Date.now(),
        title: `AI Restock Drafted with ${selectedVendor.name}: ${newApv.poNumber} (${totalCostStr})`,
        time: 'Just now',
        read: false,
        type: 'ai'
      });
      window.SupplyChainState.set('notifications', notifs);

      window.showToast('AI PO Drafted Successfully', `PO ${newApv.poNumber} assigned to ${selectedVendor.name} and forwarded to Restock Authorizations.`, 'ai');
      setTimeout(() => {
        window.location.href = 'restock-approval.html';
      }, 700);
    },

    approveRestockPo: function (apvId) {
      const approvals = window.SupplyChainState.get('approvals') || [];
      const apvIndex = approvals.findIndex(a => a.id === apvId);
      const apv = apvIndex !== -1 ? approvals[apvIndex] : approvals[0];

      if (apv) {
        if (apvIndex !== -1) {
          approvals.splice(apvIndex, 1);
        } else if (approvals.length > 0) {
          approvals.shift();
        }
        window.SupplyChainState.set('approvals', approvals);

        const orders = window.SupplyChainState.get('orders') || [];
        const newOrder = {
          id: 'ORD-' + Math.floor(9000 + Math.random() * 999),
          item: apv.item || 'Edge TPU AI Semiconductor Modules',
          sku: apv.sku || 'SKU-SEM-404',
          supplier: apv.supplier || 'Apex Precision Micro',
          origin: 'Hsinchu / Shenzhen Hub',
          destination: 'Munich Assembly Facility',
          carrier: 'Express Dedicated Freight (Air Priority)',
          status: 'In Transit',
          statusColor: 'tertiary',
          eta: 'In 5 Business Days',
          progress: 15,
          value: apv.totalCost || '₹870,000',
          priority: apv.urgency || 'Critical',
          timeline: [
            { time: 'Just now', title: 'Electronic PO Signed & Transmitted to ERP', desc: `SAP/NetSuite PO ${apv.poNumber || 'PO-2026-9921'} cleared executive threshold.`, done: true },
            { time: 'In 4 hours', title: 'Supplier Automated Production Schedule', desc: 'Supplier ERP confirmed batch allocation.', done: false },
            { time: 'Scheduled', title: 'Air Freight Cargo Handover', desc: 'Pre-manifest filed with customs.', done: false }
          ]
        };
        orders.unshift(newOrder);
        window.SupplyChainState.set('orders', orders);

        const inventory = window.SupplyChainState.get('inventory') || [];
        const invItem = inventory.find(i => i.sku === apv.sku);
        if (invItem) {
          invItem.incoming = (invItem.incoming || 0) + (apv.qty || 600);
          invItem.status = 'Incoming Replenishment';
          invItem.statusColor = 'tertiary';
          window.SupplyChainState.set('inventory', inventory);
        }

        const kpis = window.SupplyChainState.get('kpi') || {};
        kpis.todayOrders = (kpis.todayOrders || 1248) + 1;
        window.SupplyChainState.set('kpi', kpis);

        window.showToast('Purchase Order Authorized', `PO ${apv.poNumber || 'PO-2026-9921'} (${apv.totalCost || '₹870,000'}) successfully signed & dispatched.`, 'success');
      }

      if (window.renderApprovalsPage) {
        window.renderApprovalsPage();
      }
    },

    rejectRestockPo: function (apvId) {
      let approvals = window.SupplyChainState.get('approvals') || [];
      const apv = approvals.find(a => a.id === apvId) || approvals[0];
      approvals = approvals.filter(a => a.id !== (apv ? apv.id : apvId));
      window.SupplyChainState.set('approvals', approvals);

      window.showToast('Order Rejected', `PO ${apv ? apv.poNumber : apvId} has been archived.`, 'alert');
      if (window.renderApprovalsPage) {
        window.renderApprovalsPage();
      }
    },

    createNewOrder: function (orderData) {
      const orders = window.SupplyChainState.get('orders') || [];
      const newOrder = {
        id: 'ORD-' + Math.floor(9000 + Math.random() * 999),
        item: orderData.item || 'Fresh Organic Whole Milk (1 Gallon)',
        sku: orderData.sku || 'SKU-MILK-101',
        supplier: orderData.supplier || 'GreenField Dairy Farms',
        origin: orderData.origin || 'Shenzhen Cold Chain Hub',
        destination: orderData.destination || 'Chicago Cold Hub (ORD-3)',
        carrier: orderData.carrier || 'ColdExpress Refrigerated Logistics',
        status: 'In Transit',
        statusColor: 'tertiary',
        eta: orderData.eta || 'In 3 Days',
        progress: 10,
        value: orderData.value || '₹2,250.00',
        priority: orderData.priority || 'High',
        timeline: [
          { time: 'Just now', title: 'Order Dispatched to Supplier', desc: 'Order initiated via Global Grocery Portal', done: true },
          { time: 'Tomorrow 08:00', title: 'Cold-Chain Container Packaging', desc: 'Awaiting refrigerated transport consolidation', done: false },
          { time: orderData.eta || 'In 3 Days', title: 'Destination Store Delivery', desc: 'Delivery to dock', done: false }
        ]
      };

      orders.unshift(newOrder);
      window.SupplyChainState.set('orders', orders);

      // --- DEDUCT INVENTORY STOCK BY PURCHASED QUANTITY ---
      const purchasedQty = orderData.qty || parseInt(document.getElementById('new-order-qty')?.value || '500', 10);
      const inventory = window.SupplyChainState.get('inventory') || [];
      const invItem = inventory.find(i => i.sku === newOrder.sku || i.name.toLowerCase() === newOrder.item.toLowerCase());

      if (invItem) {
        invItem.onHand = Math.max(0, invItem.onHand - purchasedQty);
        if (invItem.onHand < invItem.minSafety) {
          invItem.status = invItem.onHand === 0 ? 'Out of Stock' : 'Critical Low';
          invItem.statusColor = 'error';
        } else if (invItem.onHand < invItem.minSafety * 1.2) {
          invItem.status = 'Warning';
          invItem.statusColor = 'primary-container';
        }
        window.SupplyChainState.set('inventory', inventory);
        
        if (window.renderInventoryPage) {
          window.renderInventoryPage();
        }
      }

      const kpi = window.SupplyChainState.get('kpi') || {};
      kpi.todayOrders = (kpi.todayOrders || 1248) + 1;
      window.SupplyChainState.set('kpi', kpi);

      window.showToast('Order Placed & Stock Reduced', `Order ${newOrder.id} (${newOrder.item}) placed. ${invItem ? invItem.name + ' stock reduced by ' + purchasedQty + ' units (New On-Hand: ' + invItem.onHand.toLocaleString() + ')' : ''}`, 'success');

      if (window.renderOrdersPage) {
        window.renderOrdersPage();
      }
    },


    restockSku: function (skuCode) {
      const inv = window.SupplyChainState.get('inventory') || [];
      const catalogItem = typeof GROCERY_PRODUCTS_CATALOG !== 'undefined' ? GROCERY_PRODUCTS_CATALOG.find(x => x.sku === skuCode) : null;
      const invItem = inv.find(i => i.sku === skuCode);

      const item = {
        sku: skuCode,
        name: (invItem && invItem.name) || (catalogItem && catalogItem.name) || 'Fresh Organic Whole Milk (1 Gallon)',
        category: (invItem && invItem.category) || (catalogItem && catalogItem.category) || 'Dairy & Produce',
        unitCost: (invItem && invItem.unitCost) || (catalogItem ? '₹' + catalogItem.price.toFixed(2) : '₹4.50'),
        warehouse: (invItem && invItem.warehouse) || 'Chicago Cold Hub (ORD-3)',
        supplier: (catalogItem && catalogItem.supplier) || (invItem && invItem.supplier) || 'GreenField Dairy Farms',
        status: (invItem && invItem.status) || 'Optimal'
      };

      const unitPriceNum = parseFloat(String(item.unitCost).replace(/[^0-9.]/g, '') || '4.50');
      const qty = item.sku === 'SKU-AVO-303' ? 600 : (item.sku === 'SKU-MILK-101' ? 1000 : 500);
      const totalCostNum = qty * unitPriceNum;
      const formattedTotalCost = '₹' + totalCostNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const approvals = window.SupplyChainState.get('approvals') || [];
      const newApv = {
        id: 'APV-' + Math.floor(100 + Math.random() * 900),
        poNumber: 'PO-2026-' + Math.floor(1000 + Math.random() * 9000),
        sku: item.sku,
        item: item.name,
        qty: qty,
        totalCost: formattedTotalCost,
        unitPrice: item.unitCost,
        supplier: item.supplier,
        urgency: item.status === 'Critical Low' ? 'Critical' : 'High',
        status: 'Pending Authorization',
        reason: `Manual restock request triggered for ${item.name} at ${item.warehouse}.`,
        financialImpact: `Prevents stockout loss at ${item.warehouse}`,
        confidenceScore: '99.4%',
        quotes: [
          { vendor: item.supplier + ' (Preferred)', price: item.unitCost, leadTime: '3 Days', reliability: '99.4%', selected: true },
          { vendor: 'Global Fresh Alternate', price: '₹' + (unitPriceNum * 1.15).toFixed(2), leadTime: '5 Days', reliability: '94.0%', selected: false }
        ]
      };

      approvals.unshift(newApv);
      window.SupplyChainState.set('approvals', approvals);

      window.showToast('Restock PO Drafted', `PO ${newApv.poNumber} created for ${item.name} (${item.supplier}).`, 'success');
      setTimeout(() => {
        window.location.href = 'restock-approval.html';
      }, 800);
    },


    openPaymentGateway: function (orderId, poNumber, amount, vendor, item) {
      const params = new URLSearchParams();
      if (orderId) params.set('order_id', orderId);
      if (poNumber) params.set('po', poNumber);
      if (amount) params.set('amount', amount);
      if (vendor) params.set('vendor', vendor);
      if (item) params.set('item', item);
      window.location.href = 'payments.html?' + params.toString();
    }
  };


  // --- 6. UNIFIED UI INJECTION & EVENT WIRING ---
  function initUnifiedUI() {
    const currentRoute = getCurrentRouteKey();
    if (currentRoute === 'login' || window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
      wireLoginPage();
      return;
    }

    injectGlobalModals();
    wireNavigation(currentRoute);
    wireTopBar();

    if (currentRoute === 'orders' || window.location.pathname.includes('orders')) {
      initOrdersPage();
    } else if (currentRoute === 'inventory' || window.location.pathname.includes('inventory')) {
      initInventoryPage();
    } else if (currentRoute === 'suppliers' || window.location.pathname.includes('suppliers')) {
      initSuppliersPage();
    } else if (currentRoute === 'ai_insights' || window.location.pathname.includes('ai_recommendation') || window.location.pathname.includes('ai-insights')) {
      initAiInsightsPage();
    } else if (currentRoute === 'restock_approval' || window.location.pathname.includes('restock_approval') || window.location.pathname.includes('restock-approval')) {
      initRestockApprovalPage();
    } else if (currentRoute === 'profile' || window.location.pathname.includes('profile')) {
      initProfilePage();
    } else if (currentRoute === 'dashboard' || window.location.pathname.includes('dashboard')) {
      initDashboardPage();
    }
  }

  // --- LOGIN PAGE WIRE ---
  function wireLoginPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const emailUpdated = urlParams.get('email_updated');
    const newEmail = urlParams.get('new_email');
    const nameParam = urlParams.get('name');

    const emailInput = document.getElementById('email') || document.querySelector('input[type="email"]');
    if (newEmail && emailInput) {
      emailInput.value = newEmail;
    }

    if (emailUpdated === 'true') {
      const formContainer = document.querySelector('.bg-surface-container') || document.querySelector('form')?.parentElement;
      if (formContainer && !document.getElementById('email-confirmed-alert')) {
        const alertBox = document.createElement('div');
        alertBox.id = 'email-confirmed-alert';
        alertBox.className = 'mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-start gap-3 shadow-[0_0_25px_rgba(16,185,129,0.2)] animate-pulse';
        alertBox.innerHTML = `
          <span class="material-symbols-outlined text-emerald-400 text-xl shrink-0">verified_user</span>
          <div>
            <p class="font-bold text-white text-sm">Corporate Email Updated & Verified</p>
            <p class="mt-0.5 text-emerald-200/90 leading-relaxed">
              Your profile email has been updated to <strong class="text-white font-mono">${newEmail || 'your new address'}</strong>. Please authenticate to complete session verification.
            </p>
          </div>
        `;
        formContainer.insertBefore(alertBox, formContainer.children[1] || formContainer.firstChild);
      }
    }

    const handleLogin = function (e) {
      if (e) e.preventDefault();
      const currentEmail = emailInput ? emailInput.value : 'admin@enterprise.com';
      const currentUser = window.SupplyChainState.get('user') || DEFAULT_STATE.user;
      currentUser.authenticated = true;
      if (currentEmail) currentUser.email = currentEmail;
      window.SupplyChainState.set('user', currentUser);

      window.showToast('Authentication Successful', `Welcome back, ${currentUser.name || 'Alexander Vance'}. Accessing Global Telemetry...`, 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    };

    const forms = document.querySelectorAll('form');
    forms.forEach(f => {
      f.addEventListener('submit', handleLogin);
    });

    const inputs = document.querySelectorAll('input');
    inputs.forEach(inp => {
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          handleLogin(e);
        }
      });
    });

    document.querySelectorAll('button').forEach(btn => {
      const text = btn.textContent.toLowerCase();
      if (text.includes('authenticate') || text.includes('sign in') || text.includes('sso') || text.includes('passkey')) {
        btn.onclick = handleLogin;
      }
    });
  }

  // --- GLOBAL MODALS INJECTION ---
  function injectGlobalModals() {
    if (document.getElementById('sc-global-modals')) return;

    const modalWrapper = document.createElement('div');
    modalWrapper.id = 'sc-global-modals';
    modalWrapper.innerHTML = `
      <!-- 1. NEW ORDER MODAL -->
      <div id="modal-new-order" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
        <div class="bg-[#0d1c2d] border border-[#273647] text-[#d4e4fa] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-[#273647] flex justify-between items-center bg-[#051424]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#ff5c35] text-[#5a0e00] flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
              </div>
              <h3 class="font-bold text-lg text-white">Create Freight & Procurement Order</h3>
            </div>
            <button onclick="document.getElementById('modal-new-order').classList.replace('flex','hidden')" class="text-[#bec6e0] hover:text-white p-1 rounded-lg">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <form id="form-new-order" class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-mono text-[#bec6e0] uppercase mb-1">Select Supplier</label>
                <select id="new-order-supplier" class="w-full bg-[#1c2b3c] border border-[#273647] text-white rounded-lg px-3 py-2 text-sm focus:border-[#ff5c35] focus:outline-none">
                  <option value="GreenField Dairy Farms">GreenField Dairy Farms (CN)</option>
                  <option value="Nordic Bakery & Flour Co.">Nordic Bakery & Flour Co. (NO)</option>
                  <option value="Apex Organic Produce">Apex Organic Produce (TW)</option>
                  <option value="Katanga Poultry Farms">Katanga Poultry Farms (CD)</option>
                  <option value="Nippon Organics & Foodware">Nippon Organics & Foodware (JP)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-mono text-[#bec6e0] uppercase mb-1">Target SKU / Item</label>
                <select id="new-order-sku" class="w-full bg-[#1c2b3c] border border-[#273647] text-white rounded-lg px-3 py-2 text-sm focus:border-[#ff5c35] focus:outline-none">
                  <option value="SKU-MILK-101">Fresh Organic Whole Milk (1 Gallon)</option>
                  <option value="SKU-AVO-303">Fresh Hass Avocados (Box of 24)</option>
                  <option value="SKU-BREAD-202">Whole Wheat Bread Loaves (Pack of 12)</option>
                  <option value="SKU-EGG-404">Farm Fresh Organic Eggs (Grade A 12-Pack)</option>
                  <option value="SKU-OIL-505">Extra Virgin Olive Oil (1L Bottle)</option>
                  <option value="SKU-BAN-606">Organic Cavendish Bananas (Box of 40)</option>
                </select>
              </div>

            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-mono text-[#bec6e0] uppercase mb-1">Quantity (Units)</label>
                <input id="new-order-qty" type="number" value="500" min="1" class="w-full bg-[#1c2b3c] border border-[#273647] text-white rounded-lg px-3 py-2 text-sm focus:border-[#ff5c35] focus:outline-none"/>
              </div>
              <div>
                <label class="block text-xs font-mono text-[#bec6e0] uppercase mb-1">Destination DC</label>
                <select id="new-order-dest" class="w-full bg-[#1c2b3c] border border-[#273647] text-white rounded-lg px-3 py-2 text-sm focus:border-[#ff5c35] focus:outline-none">
                  <option value="Chicago Hub (ORD-3)">Chicago Hub (ORD-3)</option>
                  <option value="Munich Assembly Facility">Munich Assembly Facility</option>
                  <option value="Austin GigaFactory">Austin GigaFactory</option>
                  <option value="Rotterdam Europort">Rotterdam Europort</option>
                  <option value="Tokyo East Hub">Tokyo East Hub</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-mono text-[#bec6e0] uppercase mb-1">Priority Freight</label>
                <select id="new-order-priority" class="w-full bg-[#1c2b3c] border border-[#273647] text-white rounded-lg px-3 py-2 text-sm focus:border-[#ff5c35] focus:outline-none">
                  <option value="High">Express Air (High Priority)</option>
                  <option value="Medium">Standard Ocean / Rail</option>
                  <option value="Critical">Critical Dedicated Convoy</option>
                </select>
              </div>
            </div>

            <div class="p-3 bg-[#051424] border border-[#273647] rounded-xl flex items-center justify-between text-xs">
              <span class="text-[#bec6e0]">Estimated Total Cost:</span>
              <span id="new-order-est-cost" class="font-bold font-mono text-base text-[#7bd0ff]">₹122,500</span>
            </div>

            <div class="pt-4 flex items-center justify-end gap-3 border-t border-[#273647]">
              <button type="button" onclick="document.getElementById('modal-new-order').classList.replace('flex','hidden')" class="px-4 py-2 rounded-lg text-[#bec6e0] hover:bg-[#1c2b3c] text-sm">Cancel</button>
              <button type="submit" class="px-5 py-2.5 rounded-lg bg-[#ff5c35] text-[#5a0e00] font-bold text-sm hover:bg-[#ffb4a3] transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">rocket_launch</span>
                <span>Authorize & Dispatch Order</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 2. AI COPILOT DRAWER -->
      <div id="drawer-ai-copilot" class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#051424] border-l border-[#273647] shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col">
        <div class="p-4 border-b border-[#273647] bg-[#0d1c2d] flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#ff5c35] flex items-center justify-center text-[#5a0e00] font-bold shadow-[0_0_12px_rgba(255,92,53,0.4)]">
              <span class="material-symbols-outlined text-sm">psychology</span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-white">FutureStack AI</h3>
              <p class="text-[10px] text-amber-300 font-mono">FutureStack Intelligence & RAG Active</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="document.getElementById('drawer-ai-copilot').classList.add('translate-x-full')" class="text-[#bec6e0] hover:text-white p-1 rounded-lg">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div id="copilot-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          <div class="flex items-start gap-2.5">
            <div class="w-6 h-6 rounded bg-[#ff5c35] text-[#5a0e00] flex items-center justify-center font-bold shrink-0 text-[10px]">AI</div>
            <div class="bg-[#122131] border border-[#273647] p-3 rounded-xl rounded-tl-none text-[#d4e4fa] leading-relaxed">
              Hello Alexander. I am FutureStack AI, monitoring 48 active international trade lanes, 6 warehouse nodes, and real-time customs tariffs. How can I assist your supply chain today?
            </div>
          </div>

          <div class="p-2.5 bg-[#0d1c2d] border border-[#273647]/60 rounded-lg space-y-1.5">
            <span class="text-[10px] font-mono text-[#bec6e0] uppercase">Suggested Inquiries:</span>
            <button onclick="window.askCopilotPrompt('Analyze stockout risks across European assembly nodes for next 30 days.')" class="w-full text-left p-1.5 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#7bd0ff] text-[11px] transition-colors flex items-center justify-between">
              <span>Evaluate European Stockout Risks</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
            </button>
            <button onclick="window.askCopilotPrompt('Simulate a 15% freight delay at Port of Yantian due to typhoon season.')" class="w-full text-left p-1.5 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#7bd0ff] text-[11px] transition-colors flex items-center justify-between">
              <span>Simulate Yantian Port Disruption</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
            </button>
            <button onclick="window.askCopilotPrompt('Which suppliers have maintained 99%+ OTIF for 12+ months?')" class="w-full text-left p-1.5 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#7bd0ff] text-[11px] transition-colors flex items-center justify-between">
              <span>Recommend Top Tier-1 Partners</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
            </button>
            <button onclick="window.askCopilotPrompt('Show Razorpay B2B payment escrow status & financial ledger')" class="w-full text-left p-1.5 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#ffb4a3] text-[11px] transition-colors flex items-center justify-between">
              <span>Inspect Payment Gateway & Escrow</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>

        </div>

        <form id="copilot-chat-form" class="p-3 border-t border-[#273647] bg-[#0d1c2d] flex items-center gap-2">
          <input id="copilot-input" type="text" placeholder="Ask FutureStack AI anything..." class="flex-1 bg-[#1c2b3c] border border-[#273647] text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#ff5c35]"/>
          <button type="submit" class="bg-[#ff5c35] text-[#5a0e00] p-2 rounded-lg hover:bg-[#ffb4a3] transition-colors">
            <span class="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>

      <!-- 3. NOTIFICATIONS DRAWER -->
      <div id="drawer-notifications" class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-[#051424] border-l border-[#273647] shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col">
        <div class="p-4 border-b border-[#273647] bg-[#0d1c2d] flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#ff5c35]">notifications</span>
            <h3 class="font-bold text-sm text-white">Telemetry Notifications</h3>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.markAllNotificationsRead()" class="text-xs text-[#7bd0ff] hover:underline">Mark all read</button>
            <button onclick="document.getElementById('drawer-notifications').classList.add('translate-x-full')" class="text-[#bec6e0] hover:text-white p-1 rounded-lg">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        <div id="notifs-list" class="flex-1 overflow-y-auto p-4 space-y-3"></div>
      </div>

      <!-- 4. FLOATING AI COPILOT BUTTON -->
      <button onclick="document.getElementById('drawer-ai-copilot').classList.toggle('translate-x-full')" class="fixed bottom-6 left-6 z-40 bg-[#ff5c35] text-[#5a0e00] p-3 rounded-full shadow-[0_0_20px_rgba(255,92,53,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-bold text-xs group" title="Open FutureStack AI">
        <span class="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">psychology</span>
        <span class="hidden sm:inline pr-1">FutureStack AI</span>
      </button>
    `;

    document.body.appendChild(modalWrapper);

    const newOrderForm = document.getElementById('form-new-order');
    if (newOrderForm) {
      newOrderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const supplier = document.getElementById('new-order-supplier').value;
        const skuSelect = document.getElementById('new-order-sku');
        const sku = skuSelect.value;
        const item = skuSelect.options[skuSelect.selectedIndex].text;
        const qty = parseInt(document.getElementById('new-order-qty').value || 500, 10);
        const destination = document.getElementById('new-order-dest').value;
        const priority = document.getElementById('new-order-priority').value;

        window.SupplyChainActions.createNewOrder({
          supplier, sku, item, qty, destination, priority,
          value: '₹' + (qty * 245).toLocaleString()
        });

        document.getElementById('modal-new-order').classList.replace('flex', 'hidden');
      });
    }

    const qtyInput = document.getElementById('new-order-qty');
    if (qtyInput) {
      qtyInput.addEventListener('input', () => {
        const val = parseInt(qtyInput.value || 0, 10);
        document.getElementById('new-order-est-cost').textContent = '₹' + (val * 245).toLocaleString();
      });
    }

    const copilotForm = document.getElementById('copilot-chat-form');
    if (copilotForm) {
      copilotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('copilot-input');
        if (!input.value.trim()) return;
        window.askCopilotPrompt(input.value.trim());
        input.value = '';
      });
    }
  }

  window.saveCopilotApiKey = function () {
    const keyInput = document.getElementById('copilot-api-key-input');
    const keyVal = keyInput ? keyInput.value.trim() : '';
    if (keyVal) {
      localStorage.setItem('sc_gemini_api_key', keyVal);
      if (window.showToast) window.showToast('Gemini API Key Saved', 'Every question will now query live Gemini API endpoints.', 'success');
    }
    const configPanel = document.getElementById('copilot-key-config');
    if (configPanel) configPanel.classList.add('hidden');
  };

  // --- COPILOT PROMPT HANDLER ---
  window.askCopilotPrompt = function (promptText) {
    const messages = document.getElementById('copilot-chat-messages');
    if (!messages) return;

    document.getElementById('drawer-ai-copilot').classList.remove('translate-x-full');

    const userMsg = document.createElement('div');
    userMsg.className = 'flex items-start gap-2.5 justify-end';
    userMsg.innerHTML = `
      <div class="bg-[#273647] p-3 rounded-xl rounded-tr-none text-white max-w-[85%]">
        ${promptText}
      </div>
      <div class="w-6 h-6 rounded bg-[#7bd0ff] text-[#003043] flex items-center justify-center font-bold shrink-0 text-[10px]">ME</div>
    `;
    messages.appendChild(userMsg);
    messages.scrollTop = messages.scrollHeight;

    const typing = document.createElement('div');
    typing.className = 'flex items-start gap-2.5 text-xs text-[#bec6e0] italic';
    typing.id = 'copilot-typing';
    typing.innerHTML = `
      <div class="w-6 h-6 rounded bg-[#ff5c35] text-[#5a0e00] flex items-center justify-center font-bold shrink-0 text-[10px]">AI</div>
      <div class="bg-[#122131] border border-[#273647] p-3 rounded-xl rounded-tl-none flex items-center gap-2">
        <span class="material-symbols-outlined text-sm animate-spin">sync</span>
        <span>Querying live AI API & multi-modal telemetry...</span>
      </div>
    `;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    const apiBase = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';
    const savedApiKey = localStorage.getItem('sc_gemini_api_key') || '';
    const savedOrKey = localStorage.getItem('sc_openrouter_api_key') || '';

    fetch(`${apiBase}/api/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: promptText,
        context: {
          api_key: savedApiKey,
          openrouter_key: savedOrKey,
          route: window.location.pathname,
          timestamp: new Date().toISOString(),
          user: window.SupplyChainState ? window.SupplyChainState.get('user') : null
        }
      })
    })


    .then(res => res.json())
    .then(data => {
      const typingEl = document.getElementById('copilot-typing');
      if (typingEl) typingEl.remove();

      const responseHtml = data.response || `Analysis completed for "${promptText}".`;
      const suggestedActions = data.suggested_actions || [];

      let actionsHtml = '';
      if (suggestedActions.length > 0) {
        actionsHtml = `
          <div class="mt-3 pt-2.5 border-t border-[#273647]/60 flex flex-wrap gap-1.5">
            ${suggestedActions.map(action => {
              if (action.includes('Payment') || action.includes('Settle')) {
                return `<button onclick="window.location.href='payments.html'" class="px-2.5 py-1 rounded bg-[#ff5c35]/20 hover:bg-[#ff5c35]/30 text-[#ffb4a3] border border-[#ff5c35]/40 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"><span class="material-symbols-outlined text-xs">account_balance_wallet</span>${action}</button>`;
              } else if (action.includes('PO') || action.includes('Authorize')) {
                return `<button onclick="window.location.href='restock-approval.html'" class="px-2.5 py-1 rounded bg-[#7bd0ff]/20 hover:bg-[#7bd0ff]/30 text-[#7bd0ff] border border-[#7bd0ff]/40 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"><span class="material-symbols-outlined text-xs">fact_check</span>${action}</button>`;
              } else {
                return `<button onclick="window.askCopilotPrompt('${action}')" class="px-2 py-1 rounded bg-[#1c2b3c] hover:bg-[#273647] text-[#d4e4fa] text-[10px] transition-all cursor-pointer">${action}</button>`;
              }
            }).join('')}
          </div>
        `;
      }

      const aiMsg = document.createElement('div');
      aiMsg.className = 'flex items-start gap-2.5';
      aiMsg.innerHTML = `
        <div class="w-6 h-6 rounded bg-[#ff5c35] text-[#5a0e00] flex items-center justify-center font-bold shrink-0 text-[10px]">AI</div>
        <div class="bg-[#122131] border border-[#273647] p-3.5 rounded-xl rounded-tl-none text-[#d4e4fa] leading-relaxed max-w-[90%] shadow-lg">
          ${responseHtml}
          ${actionsHtml}
        </div>
      `;
      messages.appendChild(aiMsg);
      messages.scrollTop = messages.scrollHeight;
    })
    .catch(err => {
      console.warn("Copilot API fallback:", err);
      const typingEl = document.getElementById('copilot-typing');
      if (typingEl) typingEl.remove();

      const aiMsg = document.createElement('div');
      aiMsg.className = 'flex items-start gap-2.5';
      aiMsg.innerHTML = `
        <div class="w-6 h-6 rounded bg-[#ff5c35] text-[#5a0e00] flex items-center justify-center font-bold shrink-0 text-[10px]">AI</div>
        <div class="bg-[#122131] border border-[#273647] p-3 rounded-xl rounded-tl-none text-[#d4e4fa] leading-relaxed max-w-[85%]">
          <strong>SupplyChain.AI Telemetry Synthesis:</strong><br/>
          Monitoring 48 active international trade lanes. OTIF running at <strong>98.2%</strong>.<br/>
          <div class="mt-2 pt-2 border-t border-[#273647]/50 flex gap-2">
            <a href="payments.html" class="text-xs text-[#ff5c35] font-bold hover:underline">Settle via Payment Gateway &rarr;</a>
          </div>
        </div>
      `;
      messages.appendChild(aiMsg);
      messages.scrollTop = messages.scrollHeight;
    });
  };


  // --- WIRE NAVIGATION ---
  function wireNavigation(activeRoute) {
    const navs = document.querySelectorAll('nav');
    const pendingApvs = (window.SupplyChainState.get('approvals') || []).length;

    navs.forEach(nav => {
      const links = nav.querySelectorAll('a');
      links.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        const icon = link.querySelector('.material-symbols-outlined') ? link.querySelector('.material-symbols-outlined').textContent.trim() : '';

        let targetHref = '';
        let routeKey = '';

        if (text.includes('payment') || text.includes('escrow') || icon === 'payments' || icon === 'account_balance_wallet') {
          targetHref = 'payments.html';
          routeKey = 'payments';
        } else if (text.includes('dashboard') || icon === 'dashboard') {
          targetHref = 'dashboard.html';
          routeKey = 'dashboard';
        } else if (text.includes('order') || icon === 'shopping_cart') {
          targetHref = 'orders.html';
          routeKey = 'orders';
        } else if (text.includes('inventory') || icon === 'inventory_2') {
          targetHref = 'inventory.html';
          routeKey = 'inventory';
        } else if (text.includes('supplier') || icon === 'factory') {
          targetHref = 'suppliers.html';
          routeKey = 'suppliers';
        } else if (text.includes('insight') || text.includes('ai') || icon === 'psychology') {
          targetHref = 'ai-insights.html';
          routeKey = 'ai_insights';
        } else if (text.includes('restock') || text.includes('approval') || icon === 'verified' || icon === 'fact_check') {
          targetHref = 'restock-approval.html';
          routeKey = 'restock_approval';
        } else if (text.includes('sign out') || text.includes('logout') || text.includes('log out') || icon === 'logout') {
          targetHref = 'index.html';
          routeKey = 'login';
        }



        if (targetHref) {
          link.href = targetHref;
          if (routeKey === activeRoute && routeKey !== 'login') {
            link.className = 'flex items-center gap-3 px-4 py-3 rounded-lg text-[#ffb4a3] font-bold border-r-4 border-[#ff5c35] bg-[#1c2b3c] transition-colors';
            const iconEl = link.querySelector('.material-symbols-outlined');
            if (iconEl) iconEl.style.fontVariationSettings = "'FILL' 1";
          } else if (routeKey !== 'login') {
            link.className = 'flex items-center gap-3 px-4 py-3 rounded-lg text-[#bec6e0] opacity-75 hover:opacity-100 hover:bg-[#1c2b3c] transition-colors';
            const iconEl = link.querySelector('.material-symbols-outlined');
            if (iconEl) iconEl.style.fontVariationSettings = "'FILL' 0";
          }
        }
      });

      const brand = nav.querySelector('a:first-child');
      if (brand && !brand.getAttribute('href')) {
        brand.href = 'dashboard.html';
      }
    });

    injectNewOrderModal();

    document.querySelectorAll('button, a').forEach(btn => {
      const text = btn.textContent.toLowerCase();
      if (text.includes('new order') || text.includes('create order') || text.includes('draft po')) {
        btn.onclick = (e) => {
          e.preventDefault();
          injectNewOrderModal();
          const modal = document.getElementById('modal-new-order');
          if (modal) {
            modal.classList.replace('hidden', 'flex');
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
          }
        };
      }
    });
  }

  // --- GROCERY NEW ORDER MODAL INJECTOR ---
  const GROCERY_PRODUCTS_CATALOG = [
    { sku: 'SKU-MILK-101', name: 'Fresh Organic Whole Milk (1 Gallon)', price: 4.50, unit: 'gal', supplier: 'GreenField Dairy Farms', origin: 'Shenzhen Cold Chain Hub', category: 'Dairy & Refrigerated' },
    { sku: 'SKU-AVO-303', name: 'Fresh Hass Avocados (Box of 24)', price: 28.00, unit: 'box', supplier: 'Apex Organic Produce', origin: 'Hsinchu Farms, TW', category: 'Fresh Produce' },
    { sku: 'SKU-BREAD-202', name: 'Whole Wheat Bread Loaves (Pack of 12)', price: 3.20, unit: 'pk', supplier: 'Nordic Bakery & Flour Co.', origin: 'Oslo Bakery Hub, NO', category: 'Bakery' },
    { sku: 'SKU-EGG-404', name: 'Farm Fresh Organic Eggs (Grade A 12-Pack)', price: 4.80, unit: 'pk', supplier: 'Katanga Poultry Farms', origin: 'Kolwezi Organic Ranch', category: 'Dairy & Poultry' },
    { sku: 'SKU-OIL-505', name: 'Extra Virgin Olive Oil (1L Bottle)', price: 14.50, unit: 'btl', supplier: 'Nippon Organics & Foodware', origin: 'Yokohama Olive Orchards, JP', category: 'Pantry Staples' },
    { sku: 'SKU-BAN-606', name: 'Organic Cavendish Bananas (Box of 40)', price: 18.00, unit: 'box', supplier: 'GreenField Dairy Farms', origin: 'Shenzhen Cold Chain Hub', category: 'Fresh Produce' }
  ];

  function injectNewOrderModal() {
    let modal = document.getElementById('modal-new-order');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-new-order';
      document.body.appendChild(modal);
    }
    modal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-[\'Inter\',sans-serif]';

    modal.innerHTML = `
      <div class="bg-[#051424] border border-[#273647] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div class="flex justify-between items-center border-b border-[#273647] pb-3">
          <h3 class="font-bold text-lg text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[#ff5c35]">add_shopping_cart</span>
            <span>Create New Grocery Order</span>
          </h3>
          <button onclick="document.getElementById('modal-new-order').style.display='none'; document.getElementById('modal-new-order').classList.replace('flex','hidden')" class="text-[#bec6e0] hover:text-white p-1 rounded">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <form id="form-new-order" onsubmit="window.handleNewOrderSubmit(event);" class="space-y-4 text-xs">
          <div>
            <label class="block text-[#bec6e0] mb-1 font-mono font-bold">SELECT GROCERY PRODUCT</label>
            <select id="new-order-sku" onchange="window.updateNewOrderFormFields(this.value)" class="w-full bg-[#0d1c2d] border border-[#273647] text-white rounded-lg p-2.5 focus:border-[#7bd0ff] outline-none font-medium">
              ${GROCERY_PRODUCTS_CATALOG.map(p => `
                <option value="${p.sku}">${p.name} — ₹${p.price.toFixed(2)}/${p.unit}</option>
              `).join('')}
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[#bec6e0] mb-1 font-mono">SUPPLIER</label>
              <input id="new-order-supplier" value="GreenField Dairy Farms" readonly class="w-full bg-[#1c2b3c] border border-[#273647] text-[#7bd0ff] rounded-lg p-2.5 outline-none font-bold"/>
            </div>
            <div>
              <label class="block text-[#bec6e0] mb-1 font-mono">ORDER QUANTITY</label>
              <input id="new-order-qty" type="number" value="500" min="1" oninput="window.calcNewOrderTotal()" class="w-full bg-[#0d1c2d] border border-[#273647] text-white rounded-lg p-2.5 outline-none focus:border-[#7bd0ff] font-bold"/>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[#bec6e0] mb-1 font-mono">ORIGIN NODE</label>
              <input id="new-order-origin" value="Shenzhen Cold Chain Hub" class="w-full bg-[#0d1c2d] border border-[#273647] text-white rounded-lg p-2.5 outline-none"/>
            </div>
            <div>
              <label class="block text-[#bec6e0] mb-1 font-mono">DESTINATION HUB</label>
              <select id="new-order-dest" class="w-full bg-[#0d1c2d] border border-[#273647] text-white rounded-lg p-2.5 outline-none">
                <option value="Chicago Distribution Hub (ORD-3)">Chicago Cold Hub (ORD-3)</option>
                <option value="Munich Fresh Facility">Munich Fresh Facility</option>
                <option value="Rotterdam Bakery Depot">Rotterdam Bakery Depot</option>
                <option value="Austin Farm Hub">Austin Farm Hub</option>
                <option value="Seattle Grocery Center">Seattle Grocery Center</option>
              </select>
            </div>
          </div>
          <div class="p-3 bg-[#0d1c2d] rounded-xl border border-[#273647] flex justify-between items-center">
            <span class="text-[#bec6e0] font-mono">CALCULATED VALUE:</span>
            <span id="new-order-total" class="font-mono text-base text-[#7bd0ff] font-bold">₹2,250.00</span>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" onclick="document.getElementById('modal-new-order').style.display='none'; document.getElementById('modal-new-order').classList.replace('flex','hidden')" class="px-4 py-2 rounded-lg bg-[#1c2b3c] text-white hover:bg-[#273647]">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-lg bg-[#ff5c35] text-[#5a0e00] font-bold hover:bg-[#ffb4a3] shadow-md flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">local_shipping</span>
              <span>Dispatch Order</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  window.updateNewOrderFormFields = function (sku) {
    const p = GROCERY_PRODUCTS_CATALOG.find(x => x.sku === sku) || GROCERY_PRODUCTS_CATALOG[0];
    const supEl = document.getElementById('new-order-supplier');
    const origEl = document.getElementById('new-order-origin');
    if (supEl) supEl.value = p.supplier;
    if (origEl) origEl.value = p.origin;
    window.calcNewOrderTotal();
  };

  window.calcNewOrderTotal = function () {
    const sku = document.getElementById('new-order-sku')?.value || 'SKU-MILK-101';
    const qty = parseInt(document.getElementById('new-order-qty')?.value || '500', 10);
    const p = GROCERY_PRODUCTS_CATALOG.find(x => x.sku === sku) || GROCERY_PRODUCTS_CATALOG[0];
    const total = qty * p.price;
    const totalEl = document.getElementById('new-order-total');
    if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  window.handleNewOrderSubmit = function (e) {
    e.preventDefault();
    const sku = document.getElementById('new-order-sku').value;
    const qty = parseInt(document.getElementById('new-order-qty').value, 10);
    const p = GROCERY_PRODUCTS_CATALOG.find(x => x.sku === sku) || GROCERY_PRODUCTS_CATALOG[0];
    const dest = document.getElementById('new-order-dest').value;
    const totalVal = '₹' + (qty * p.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    window.SupplyChainActions.createNewOrder({
      item: p.name,
      sku: p.sku,
      qty: qty,
      supplier: p.supplier,
      origin: p.origin,
      destination: dest,
      carrier: 'ColdExpress Refrigerated Logistics',
      value: totalVal,
      priority: 'High',
      eta: 'In 3 Days'
    });


    const modal = document.getElementById('modal-new-order');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.replace('flex', 'hidden');
    }
  };


  // --- WIRE TOPBAR & ACTIONS ---
  function wireTopBar() {
    document.querySelectorAll('header button, header a').forEach(el => {
      const text = el.textContent.toLowerCase();
      if (text.includes('restock approval')) {
        el.onclick = (e) => {
          e.preventDefault();
          window.location.href = 'restock-approval.html';
        };
      }
    });

    document.querySelectorAll('header button').forEach(btn => {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon && icon.textContent.trim() === 'notifications') {
        const notifs = window.SupplyChainState.get('notifications') || [];
        const unreadCount = notifs.filter(n => !n.read).length;
        
        if (unreadCount > 0 && !btn.querySelector('.notif-badge')) {
          btn.classList.add('relative');
          const badge = document.createElement('span');
          badge.className = 'notif-badge absolute top-1 right-1 w-2.5 h-2.5 bg-[#ff5c35] rounded-full animate-pulse';
          btn.appendChild(badge);
        }

        btn.onclick = (e) => {
          e.preventDefault();
          renderNotificationsDrawer();
          document.getElementById('drawer-notifications').classList.toggle('translate-x-full');
        };
      }
    });

    const mobileMenuBtns = document.querySelectorAll('button span.material-symbols-outlined');
    mobileMenuBtns.forEach(span => {
      if (span.textContent.trim() === 'menu') {
        const btn = span.closest('button');
        btn.onclick = (e) => {
          e.preventDefault();
          toggleMobileDrawer();
        };
      }
    });

    syncUserHeaders();
  }

  // --- USER HEADER & AVATAR SYNCHRONIZATION ---
  function syncUserHeaders() {
    const user = window.SupplyChainState.get('user') || DEFAULT_STATE.user;
    if (!user) return;

    // Update avatar image sources
    if (user.avatar) {
      document.querySelectorAll('header img, #header-user-avatar, img[alt="Alexander Vance"], img[alt="User Profile"], img[alt="Profile Picture"]').forEach(img => {
        if (img.closest('#sc-global-modals') || img.closest('#drawer-ai-copilot') || img.classList.contains('supplier-avatar') || img.closest('.preset-avatar-btn')) return;
        img.src = user.avatar;
        img.alt = user.name || 'User Profile';
      });
    }

    // Ensure header avatar element is clickable to profile
    document.querySelectorAll('header .rounded-full').forEach(el => {
      const parentLink = el.closest('a');
      if (parentLink) {
        parentLink.href = 'profile.html';
        parentLink.title = `Profile: ${user.name || 'Alexander Vance'}`;
      } else if (!el.onclick) {
        el.style.cursor = 'pointer';
        el.title = `Profile: ${user.name || 'Alexander Vance'}`;
        el.onclick = () => { window.location.href = 'profile.html'; };
      }
    });
  }

  // --- MOBILE DRAWER ---
  function toggleMobileDrawer() {
    let mobileDrawer = document.getElementById('sc-mobile-drawer');
    if (!mobileDrawer) {
      mobileDrawer = document.createElement('div');
      mobileDrawer.id = 'sc-mobile-drawer';
      mobileDrawer.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-6 text-white';
      mobileDrawer.innerHTML = `
        <div class="flex justify-between items-center mb-8 border-b border-[#273647] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-[#ff5c35] text-[#5a0e00] flex items-center justify-center font-bold">S</div>
            <h2 class="font-bold text-lg">SupplyChain.AI</h2>
          </div>
          <button onclick="document.getElementById('sc-mobile-drawer').remove()" class="p-2">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="space-y-3 flex-1 overflow-y-auto text-base">
          <a href="dashboard.html" class="flex items-center gap-3 p-3 rounded-lg bg-[#1c2b3c]"><span class="material-symbols-outlined">dashboard</span> Dashboard</a>
          <a href="orders.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1c2b3c]"><span class="material-symbols-outlined">shopping_cart</span> Orders & Logistics</a>
          <a href="inventory.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1c2b3c]"><span class="material-symbols-outlined">inventory_2</span> Inventory Intelligence</a>
          <a href="suppliers.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1c2b3c]"><span class="material-symbols-outlined">factory</span> Supplier Management</a>
          <a href="ai-insights.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1c2b3c]"><span class="material-symbols-outlined">psychology</span> AI Demand Insights</a>
          <a href="restock-approval.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1c2b3c]"><span class="material-symbols-outlined">fact_check</span> Restock Approvals</a>
          <a href="payments.html" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1c2b3c]"><span class="material-symbols-outlined">account_balance_wallet</span> Payment Gateway & Escrow</a>
        </div>

        <div class="pt-6 border-t border-[#273647] space-y-3">
          <button onclick="document.getElementById('modal-new-order').classList.replace('hidden','flex'); document.getElementById('sc-mobile-drawer').remove();" class="w-full bg-[#ff5c35] text-[#5a0e00] py-3 rounded-lg font-bold flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">add</span> Create New Order
          </button>
          <a href="index.html" class="block text-center text-[#bec6e0] text-sm py-2">Sign Out</a>
        </div>
      `;
      document.body.appendChild(mobileDrawer);
    } else {
      mobileDrawer.remove();
    }
  }

  // --- RENDER NOTIFICATIONS ---
  function renderNotificationsDrawer() {
    const list = document.getElementById('notifs-list');
    if (!list) return;
    const notifs = window.SupplyChainState.get('notifications') || [];
    
    if (notifs.length === 0) {
      list.innerHTML = `<div class="text-center text-sm text-[#bec6e0] py-8">No notifications at this time.</div>`;
      return;
    }

    list.innerHTML = notifs.map(n => `
      <div class="p-3.5 rounded-xl border ${n.read ? 'bg-[#0d1c2d] border-[#273647]/50 opacity-70' : 'bg-[#122131] border-[#ff5c35]/40'} flex items-start gap-3 transition-all">
        <span class="material-symbols-outlined text-base mt-0.5 ${n.type === 'ai' ? 'text-[#ff5c35]' : n.type === 'alert' ? 'text-[#ffb4ab]' : 'text-[#7bd0ff]'}">
          ${n.type === 'ai' ? 'psychology' : n.type === 'alert' ? 'warning' : 'local_shipping'}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-white leading-snug">${n.title}</p>
          <span class="text-[10px] text-[#bec6e0] font-mono mt-1 block">${n.time}</span>
        </div>
      </div>
    `).join('');
  }

  window.markAllNotificationsRead = function () {
    const notifs = window.SupplyChainState.get('notifications') || [];
    notifs.forEach(n => n.read = true);
    window.SupplyChainState.set('notifications', notifs);
    renderNotificationsDrawer();
    document.querySelectorAll('.notif-badge').forEach(b => b.remove());
    window.showToast('Notifications Cleared', 'All alerts marked as read.', 'success');
  };

  // --- 7. ORDERS PAGE ---
  function initOrdersPage() {
    window.renderOrdersPage = function (filterStatus = 'ALL') {
      const orders = window.SupplyChainState.get('orders') || [];
      const tableBody = document.querySelector('tbody');
      
      let filteredOrders = orders;
      if (filterStatus && filterStatus !== 'ALL') {
        filteredOrders = orders.filter(o => o.status.toUpperCase().includes(filterStatus.toUpperCase()));
      }

      if (tableBody) {
        tableBody.innerHTML = filteredOrders.map((ord, idx) => `
          <tr class="border-b border-[#273647] hover:bg-[#1c2b3c]/50 transition-colors cursor-pointer ${idx === 0 ? 'bg-[#1c2b3c]/30' : ''}" onclick="window.selectOrder('${ord.id}')">
            <td class="py-4 px-4 font-mono font-bold text-[#7bd0ff]">${ord.id}</td>
            <td class="py-4 px-4">
              <div class="font-bold text-white">${ord.item}</div>
              <div class="text-xs text-[#bec6e0]">${ord.supplier} &bull; <span class="font-mono">${ord.sku}</span></div>
            </td>
            <td class="py-4 px-4 text-xs text-[#d4e4fa]">
              <div>${ord.origin}</div>
              <div class="text-[#bec6e0]">&rarr; ${ord.destination}</div>
            </td>
            <td class="py-4 px-4">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono ${
                ord.status === 'Delivered' ? 'bg-[#009ed5]/20 text-[#7bd0ff]' :
                ord.status === 'Customs Hold' ? 'bg-[#93000a]/40 text-[#ffb4ab]' :
                'bg-[#ff5c35]/20 text-[#ffb4a3]'
              }">
                <span class="w-1.5 h-1.5 rounded-full ${ord.status === 'Delivered' ? 'bg-[#7bd0ff]' : ord.status === 'Customs Hold' ? 'bg-[#ffb4ab]' : 'bg-[#ff5c35]'}"></span>
                ${ord.status}
              </span>
            </td>
            <td class="py-4 px-4 font-mono text-xs text-white">${ord.eta}</td>
            <td class="py-4 px-4 font-mono font-bold text-[#7bd0ff]">${ord.value}</td>
            <td class="py-4 px-4 text-right">
              <button onclick="event.stopPropagation(); window.selectOrder('${ord.id}')" class="p-1.5 hover:bg-[#273647] rounded-lg text-[#bec6e0] hover:text-white transition-colors" title="Inspect Telemetry">
                <span class="material-symbols-outlined text-sm">visibility</span>
              </button>
            </td>
          </tr>
        `).join('');
      }

      if (filteredOrders.length > 0) {
        window.selectOrder(filteredOrders[0].id, false);
      }
    };

    window.selectOrder = function (orderId, showToastAlert = true) {
      const orders = window.SupplyChainState.get('orders') || [];
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const detailContainer = document.querySelector('.lg\\:col-span-4, .md\\:col-span-4');
      if (detailContainer) {
        detailContainer.innerHTML = `
          <div class="bg-[#051424] border border-[#273647] rounded-2xl p-6 shadow-xl sticky top-24">
            <div class="flex justify-between items-start mb-6">
              <div>
                <span class="text-[10px] font-mono text-[#bec6e0] uppercase">Tracking Inspector</span>
                <h3 class="font-bold text-xl text-white">${order.id}</h3>
                <p class="text-xs text-[#7bd0ff] font-mono mt-0.5">${order.carrier}</p>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                order.status === 'Delivered' ? 'bg-[#009ed5]/20 text-[#7bd0ff]' :
                order.status === 'Customs Hold' ? 'bg-[#93000a]/40 text-[#ffb4ab]' :
                'bg-[#ff5c35]/20 text-[#ffb4a3]'
              }">${order.status}</span>
            </div>

            <div class="space-y-3 mb-6 p-3 bg-[#0d1c2d] border border-[#273647] rounded-xl text-xs">
              <div class="flex justify-between"><span class="text-[#bec6e0]">Item Cargo:</span><span class="font-bold text-white">${order.item}</span></div>
              <div class="flex justify-between"><span class="text-[#bec6e0]">Supplier:</span><span class="text-[#d4e4fa]">${order.supplier}</span></div>
              <div class="flex justify-between"><span class="text-[#bec6e0]">Value:</span><span class="font-mono text-[#7bd0ff] font-bold">${order.value}</span></div>
              <div class="flex justify-between"><span class="text-[#bec6e0]">Estimated Arrival:</span><span class="font-mono text-white">${order.eta}</span></div>
            </div>

            <h4 class="font-bold text-xs font-mono text-[#bec6e0] uppercase mb-4">Milestone Telemetry</h4>
            <div class="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#273647]">
              ${order.timeline.map(t => `
                <div class="flex items-start gap-3 relative z-10 text-xs">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${t.done ? 'bg-[#ff5c35] text-[#5a0e00]' : 'bg-[#1c2b3c] text-[#bec6e0] border border-[#273647]'}">
                    <span class="material-symbols-outlined text-xs">${t.done ? 'check' : 'radio_button_unchecked'}</span>
                  </div>
                  <div>
                    <div class="font-bold text-white">${t.title}</div>
                    <div class="text-[#bec6e0] text-[11px] mt-0.5">${t.desc}</div>
                    <div class="text-[10px] font-mono text-[#7bd0ff] mt-1">${t.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>

            ${order.status === 'Customs Hold' ? `
              <div class="mt-6 pt-4 border-t border-[#273647]">
                <button onclick="window.showToast('Customs Exemption Expedited', 'Autonomous Annex VII paperwork dispatched to border authority.', 'ai');" class="w-full py-2.5 bg-[#ff5c35] text-[#5a0e00] rounded-lg font-bold text-xs hover:bg-[#ffb4a3] transition-colors flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-sm">bolt</span>
                  <span>Autonomous Customs Expedite</span>
                </button>
              </div>
            ` : ''}
          </div>
        `;
      }
      if (showToastAlert) {
        window.showToast('Inspecting Order ' + order.id, `${order.item} (${order.status})`, 'ai');
      }
    };

    // Wire search inputs
    document.querySelectorAll('input[type="text"]').forEach(input => {
      input.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        rows.forEach(r => {
          r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    });

    // Wire filter buttons
    document.querySelectorAll('.flex-wrap button, .overflow-x-auto button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = btn.textContent.toUpperCase();
        document.querySelectorAll('.flex-wrap button').forEach(b => {
          b.className = 'px-3 py-1 rounded-full bg-surface-container-high text-secondary hover:text-white font-mono text-xs transition-colors';
        });
        btn.className = 'px-3 py-1 rounded-full bg-primary-container/20 text-primary border border-primary/30 font-mono text-xs font-bold';

        if (text.includes('TRANSIT')) {
          window.renderOrdersPage('IN TRANSIT');
        } else if (text.includes('CUSTOMS') || text.includes('HOLD')) {
          window.renderOrdersPage('CUSTOMS HOLD');
        } else if (text.includes('DELIVERED')) {
          window.renderOrdersPage('DELIVERED');
        } else {
          window.renderOrdersPage('ALL');
        }
      });
    });

    window.renderOrdersPage('ALL');
  }

  // --- 8. INVENTORY PAGE ---
  function initInventoryPage() {
    window.renderInventoryPage = function (filterStatus = 'ALL') {
      const inv = window.SupplyChainState.get('inventory') || [];
      const tableBody = document.querySelector('tbody');

      let filtered = inv;
      if (filterStatus && filterStatus !== 'ALL') {
        filtered = inv.filter(i => i.status.toUpperCase().includes(filterStatus.toUpperCase()));
      }

      if (tableBody) {
        tableBody.innerHTML = filtered.map(i => `
          <tr class="border-b border-[#273647] hover:bg-[#1c2b3c]/50 transition-colors">
            <td class="py-4 px-4 font-mono text-[#7bd0ff] font-bold">${i.sku}</td>
            <td class="py-4 px-4">
              <div class="font-bold text-white">${i.name}</div>
              <div class="text-xs text-[#bec6e0]">${i.category}</div>
            </td>
            <td class="py-4 px-4 text-xs text-[#d4e4fa]">${i.warehouse}</td>
            <td class="py-4 px-4 font-mono font-bold ${i.onHand < i.minSafety ? 'text-[#ffb4ab]' : 'text-white'}">${i.onHand.toLocaleString()} units</td>
            <td class="py-4 px-4 font-mono text-xs text-[#bec6e0]">${i.minSafety.toLocaleString()} units</td>
            <td class="py-4 px-4">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-mono ${
                i.status === 'Optimal' ? 'bg-[#009ed5]/20 text-[#7bd0ff]' :
                i.status === 'Critical Low' ? 'bg-[#93000a]/40 text-[#ffb4ab]' :
                'bg-[#ff5c35]/20 text-[#ffb4a3]'
              }">
                ${i.status}
              </span>
            </td>
            <td class="py-4 px-4 text-right">
              <button onclick="window.SupplyChainActions.restockSku('${i.sku}')" class="px-3 py-1.5 rounded-lg bg-[#ff5c35] text-[#5a0e00] font-bold text-xs hover:bg-[#ffb4a3] transition-colors flex items-center gap-1.5 ml-auto">
                <span class="material-symbols-outlined text-xs">add_shopping_cart</span>
                <span>Restock SKU</span>
              </button>
            </td>
          </tr>
        `).join('');
      }
    };

    document.querySelectorAll('input[type="text"]').forEach(input => {
      input.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('tbody tr').forEach(r => {
          r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    });

    document.querySelectorAll('.flex-wrap button').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.textContent.toUpperCase();
        document.querySelectorAll('.flex-wrap button').forEach(b => {
          b.className = 'px-3 py-1 rounded-full bg-surface-container-high text-secondary hover:text-white font-mono text-xs transition-colors';
        });
        btn.className = 'px-3 py-1 rounded-full bg-primary-container/20 text-primary border border-primary/30 font-mono text-xs font-bold';

        if (text.includes('OPTIMAL')) {
          window.renderInventoryPage('OPTIMAL');
        } else if (text.includes('WARNING')) {
          window.renderInventoryPage('WARNING');
        } else if (text.includes('CRITICAL')) {
          window.renderInventoryPage('CRITICAL');
        } else {
          window.renderInventoryPage('ALL');
        }
      });
    });

    window.renderInventoryPage('ALL');
  }

  // --- 9. SUPPLIERS PAGE ---
  function initSuppliersPage() {
    document.querySelectorAll('input[type="text"]').forEach(input => {
      input.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.grid > div').forEach(card => {
          card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    });
  }

  // --- 10. AI INSIGHTS PAGE ---
  function initAiInsightsPage() {
    let currentFilter = 'all';

    window.filterAiInsights = function (filterType) {
      currentFilter = filterType;
      window.renderAiInsightsPage();
    };

    window.renderAiInsightsPage = function () {
      const container = document.getElementById('ai-insights-dynamic-container') || document.querySelector('.p-4.md\\:p-8.flex-1.space-y-6');
      if (!container) return;

      const recs = window.SupplyChainState.get('aiRecommendations') || [];
      const filteredRecs = recs.filter(r => {
        if (currentFilter === 'profit') return r.financialOutcome === 'PROFIT';
        if (currentFilter === 'loss') return r.financialOutcome === 'LOSS_RISK';
        return true;
      });

      const totalProfitNum = 74000;
      const totalLossAvoidedNum = 14500;

      container.innerHTML = `
        <!-- Page Header & Metrics Overview -->
        <div class="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-2 border-b border-outline-variant/30">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="mono text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Historical Purchase Pattern Intelligence & Financial Forecast</span>
            </div>
            <h1 class="geist font-extrabold text-2xl md:text-3xl text-white">AI Demand Insights & Sourcing Optimization</h1>
            <p class="text-sm text-[#bec6e0] mt-1">Predictive neural telemetry evaluating past purchase order velocity, future profit vs loss projections, and autonomous vendor arbitrage.</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <button onclick="document.getElementById('drawer-ai-copilot').classList.toggle('translate-x-full')" class="flex items-center gap-1.5 px-4 py-2.5 bg-[#ff5c35] text-white font-bold rounded-xl text-xs hover:bg-[#b52701] transition-all shadow-lg shadow-[#ff5c35]/25 active:scale-95">
              <span class="material-symbols-outlined text-sm">psychology</span>
              <span>Open AI Copilot Chat</span>
            </button>
          </div>
        </div>

        <!-- Telemetry Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-[#122131]/80 border border-[#273647] rounded-xl p-4 shadow-lg flex items-center justify-between">
            <div>
              <p class="text-[11px] mono text-[#bec6e0] uppercase">Projected Net Profit</p>
              <h3 class="text-xl font-extrabold text-emerald-400 geist mt-0.5">+₹74,000.00</h3>
              <p class="text-[10px] text-[#bec6e0] mt-0.5">Avg +30.9% Gross ROI</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center justify-center">
              <span class="material-symbols-outlined">trending_up</span>
            </div>
          </div>

          <div class="bg-[#122131]/80 border border-[#273647] rounded-xl p-4 shadow-lg flex items-center justify-between">
            <div>
              <p class="text-[11px] mono text-[#bec6e0] uppercase">Loss & Spoilage Avoidance</p>
              <h3 class="text-xl font-extrabold text-amber-400 geist mt-0.5">-₹14,500.00</h3>
              <p class="text-[10px] text-[#bec6e0] mt-0.5">Demurrage & stockout penalty shielded</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-400 flex items-center justify-center">
              <span class="material-symbols-outlined">shield_with_heart</span>
            </div>
          </div>

          <div class="bg-[#122131]/80 border border-[#273647] rounded-xl p-4 shadow-lg flex items-center justify-between">
            <div>
              <p class="text-[11px] mono text-[#bec6e0] uppercase">Analyzed Past POs</p>
              <h3 class="text-xl font-extrabold text-[#7bd0ff] geist mt-0.5">48 Orders</h3>
              <p class="text-[10px] text-[#bec6e0] mt-0.5">90-Day rolling purchase telemetry</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-[#7bd0ff] flex items-center justify-center">
              <span class="material-symbols-outlined">history</span>
            </div>
          </div>

          <div class="bg-[#122131]/80 border border-[#273647] rounded-xl p-4 shadow-lg flex items-center justify-between">
            <div>
              <p class="text-[11px] mono text-[#bec6e0] uppercase">Supplier Decision Engine</p>
              <h3 class="text-xl font-extrabold text-white geist mt-0.5">Tier-1 Vetted</h3>
              <p class="text-[10px] text-emerald-400 mt-0.5">Active Vendor Arbitrage Ready</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-[#ff5c35]/20 border border-[#ff5c35]/50 text-[#ff5c35] flex items-center justify-center">
              <span class="material-symbols-outlined">swap_horiz</span>
            </div>
          </div>
        </div>

        <!-- Filter Tab Buttons -->
        <div class="flex flex-wrap items-center gap-2 pt-2">
          <button onclick="window.filterAiInsights('all')" class="px-4 py-2 rounded-lg text-xs mono font-bold transition-all ${currentFilter === 'all' ? 'bg-[#ff5c35] text-white shadow-md shadow-[#ff5c35]/30' : 'bg-[#122131] text-[#bec6e0] hover:text-white border border-[#273647]'}">
            All Neural Insights (${recs.length})
          </button>
          <button onclick="window.filterAiInsights('profit')" class="px-4 py-2 rounded-lg text-xs mono font-bold transition-all ${currentFilter === 'profit' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-[#122131] text-[#bec6e0] hover:text-white border border-[#273647]'}">
            🟢 Projected Profit Opportunities (${recs.filter(r => r.financialOutcome === 'PROFIT').length})
          </button>
          <button onclick="window.filterAiInsights('loss')" class="px-4 py-2 rounded-lg text-xs mono font-bold transition-all ${currentFilter === 'loss' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' : 'bg-[#122131] text-[#bec6e0] hover:text-white border border-[#273647]'}">
            🔴 Risk & Loss Avoidance (${recs.filter(r => r.financialOutcome === 'LOSS_RISK').length})
          </button>
        </div>

        <!-- Dynamic Recommendation Cards List -->
        <div class="space-y-6">
          ${filteredRecs.map(rec => {
            const selectedKey = rec.selectedVendorKey || 'popularTrusted';
            const incumbent = rec.vendors?.incumbent || {
              name: 'Current Incumbent Supplier',
              price: '₹28.00 / unit',
              unitCostNum: 28.00,
              totalCost: '₹16,800',
              leadTime: '5 Days',
              otif: '94.2%',
              trustScore: 88,
              projectedProfit: '+₹38,400',
              description: 'Standard historical terms and delivery lead time.'
            };
            const popular = rec.vendors?.popularTrusted || {
              name: 'Apex Organic Produce',
              price: '₹26.20 / unit',
              unitCostNum: 26.20,
              totalCost: '₹15,720',
              leadTime: '3 Days',
              otif: '99.4%',
              trustScore: 98,
              badge: '🔥 Top Rated & Popular',
              projectedProfit: '+₹42,800',
              savingsVsIncumbent: 'Save ₹1,080 + 2 Days Faster',
              description: 'Tier-1 Certified organic supplier with 99.4% OTIF compliance.'
            };

            const activeVendor = selectedKey === 'popularTrusted' ? popular : incumbent;
            const isProfit = rec.financialOutcome === 'PROFIT';

            return `
              <div class="bg-[#0b1b2b] border ${isProfit ? 'border-emerald-500/40' : 'border-amber-500/40'} rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden transition-all">
                <!-- Top Badge & Title Row -->
                <div class="flex flex-col lg:flex-row justify-between lg:items-start gap-4 pb-4 border-b border-[#273647]">
                  <div class="space-y-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="px-3 py-1 rounded-full text-xs mono font-extrabold ${isProfit ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80' : 'bg-amber-950 text-amber-300 border border-amber-700/80'}">
                        ${isProfit ? '🟢 PROJECTED PROFIT OPPORTUNITY' : '🔴 POTENTIAL LOSS & RISK SHIELD'}
                      </span>
                      <span class="px-3 py-1 rounded-full bg-[#122131] text-[#7bd0ff] text-xs mono font-bold border border-[#273647]">
                        ${rec.category}
                      </span>
                      <span class="px-3 py-1 rounded-full bg-[#051424] text-[#bec6e0] text-xs mono font-bold border border-[#273647]">
                        CONFIDENCE: ${rec.confidence}
                      </span>
                    </div>

                    <h2 class="text-xl md:text-2xl font-extrabold text-white geist">
                      ${rec.title}
                    </h2>
                    <p class="text-sm text-[#bec6e0] leading-relaxed">
                      ${rec.summary}
                    </p>
                  </div>

                  <!-- Financial Outcome Stat Box -->
                  <div class="shrink-0 p-4 rounded-xl ${isProfit ? 'bg-emerald-950/60 border border-emerald-700/60 text-emerald-400' : 'bg-amber-950/60 border border-amber-700/60 text-amber-400'} text-right min-w-[240px]">
                    <span class="text-[10px] mono uppercase block opacity-80">${rec.profitOrLossLabel}</span>
                    <strong class="text-xl md:text-2xl geist font-extrabold block mt-0.5">${rec.projectedProfitLoss}</strong>
                    <span class="text-[11px] block mt-1 opacity-90">${isProfit ? 'Net profit on upcoming stock cycle' : 'Loss prevented vs incumbent delay'}</span>
                  </div>
                </div>

                <!-- Previous Purchase Pattern Telemetry Box -->
                <div class="bg-[#051424] border border-[#273647] rounded-xl p-4 md:p-5 space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-sm text-[#7bd0ff]">insights</span>
                      <h4 class="text-xs font-bold text-white mono uppercase tracking-wider">1. Telemetry: Previous Purchase Pattern Analysis</h4>
                    </div>
                    <span class="text-[11px] mono text-[#7bd0ff]">SKU: ${rec.sku}</span>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    <div class="p-2.5 rounded-lg bg-[#122131]/90 border border-[#273647]">
                      <span class="text-[#bec6e0] block text-[10px]">HISTORICAL PO COUNT</span>
                      <strong class="text-white text-xs">${rec.purchasePattern?.ordersCount || '14 POs (Past 90 Days)'}</strong>
                    </div>
                    <div class="p-2.5 rounded-lg bg-[#122131]/90 border border-[#273647]">
                      <span class="text-[#bec6e0] block text-[10px]">AVG REORDER CYCLE</span>
                      <strong class="text-[#7bd0ff] text-xs">${rec.purchasePattern?.avgCycleDays || '6.2 Days'}</strong>
                    </div>
                    <div class="p-2.5 rounded-lg bg-[#122131]/90 border border-[#273647]">
                      <span class="text-[#bec6e0] block text-[10px]">SELL-THROUGH VELOCITY</span>
                      <strong class="text-emerald-400 text-xs">${rec.purchasePattern?.sellThroughRate || '98.6% in 72h'}</strong>
                    </div>
                    <div class="p-2.5 rounded-lg bg-[#122131]/90 border border-[#273647]">
                      <span class="text-[#bec6e0] block text-[10px]">HISTORICAL UNIT PRICE</span>
                      <strong class="text-amber-300 text-xs">${rec.purchasePattern?.historicalUnitPrice || '₹28.00/unit'}</strong>
                    </div>
                  </div>

                  <p class="text-xs text-[#d4e4fa] bg-[#122131]/50 p-3 rounded-lg border border-[#273647]/60 leading-relaxed">
                    <strong>AI Telemetry Interpretation:</strong> ${rec.financialReasoning}
                  </p>
                </div>

                <!-- 2. Vendor Selection Matrix: Keep Same vs Switch to Popular/Trusted -->
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-sm text-[#ff5c35]">swap_horizontal_circle</span>
                      <h4 class="text-xs font-bold text-white mono uppercase tracking-wider">2. Supplier Decision: Choose Incumbent or Switch to Popular Trusted Vendor</h4>
                    </div>
                    <span class="text-[11px] mono text-[#bec6e0]">Click card to select</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Option A: Same / Incumbent Vendor -->
                    <div onclick="window.SupplyChainActions.selectAiVendor('${rec.id}', 'incumbent')" class="cursor-pointer rounded-xl p-4 border transition-all ${selectedKey === 'incumbent' ? 'bg-[#1c2b3c] border-[#ff5c35] ring-2 ring-[#ff5c35]/50 shadow-lg' : 'bg-[#122131]/70 border-[#273647] hover:border-[#5b413a] opacity-80 hover:opacity-100'}">
                      <div class="flex items-start justify-between">
                        <div class="flex items-center gap-2">
                          <input type="radio" name="vendor_choice_${rec.id}" ${selectedKey === 'incumbent' ? 'checked' : ''} class="accent-[#ff5c35] w-4 h-4 cursor-pointer" />
                          <div>
                            <span class="text-[10px] mono text-[#bec6e0] uppercase block">Option A &bull; Previous Supplier</span>
                            <strong class="text-white text-sm geist">${incumbent.name}</strong>
                          </div>
                        </div>
                        <span class="px-2 py-0.5 rounded text-[10px] mono font-bold bg-[#273647] text-[#bec6e0]">INCUMBENT</span>
                      </div>

                      <div class="grid grid-cols-3 gap-2 my-3 text-xs mono">
                        <div class="bg-[#051424] p-2 rounded border border-[#273647]">
                          <span class="text-[10px] text-[#bec6e0] block">UNIT PRICE</span>
                          <strong class="text-white">${incumbent.price}</strong>
                        </div>
                        <div class="bg-[#051424] p-2 rounded border border-[#273647]">
                          <span class="text-[10px] text-[#bec6e0] block">LEAD TIME</span>
                          <strong class="text-amber-400">${incumbent.leadTime}</strong>
                        </div>
                        <div class="bg-[#051424] p-2 rounded border border-[#273647]">
                          <span class="text-[10px] text-[#bec6e0] block">TRUST SCORE</span>
                          <strong class="text-white">${incumbent.trustScore}/100</strong>
                        </div>
                      </div>

                      <p class="text-[11px] text-[#bec6e0] leading-snug">
                        ${incumbent.description}
                      </p>
                    </div>

                    <!-- Option B: Popular / Trusted Vendor (Recommended) -->
                    <div onclick="window.SupplyChainActions.selectAiVendor('${rec.id}', 'popularTrusted')" class="cursor-pointer rounded-xl p-4 border transition-all ${selectedKey === 'popularTrusted' ? 'bg-[#1c2b3c] border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg' : 'bg-[#122131]/70 border-[#273647] hover:border-emerald-500/50 opacity-80 hover:opacity-100'}">
                      <div class="flex items-start justify-between">
                        <div class="flex items-center gap-2">
                          <input type="radio" name="vendor_choice_${rec.id}" ${selectedKey === 'popularTrusted' ? 'checked' : ''} class="accent-emerald-500 w-4 h-4 cursor-pointer" />
                          <div>
                            <span class="text-[10px] mono text-emerald-400 uppercase font-bold block">Option B &bull; AI Top Recommendation</span>
                            <strong class="text-white text-sm geist">${popular.name}</strong>
                          </div>
                        </div>
                        <span class="px-2.5 py-0.5 rounded text-[10px] mono font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-700/80">${popular.badge || '🔥 POPULAR CHOICE'}</span>
                      </div>

                      <div class="grid grid-cols-3 gap-2 my-3 text-xs mono">
                        <div class="bg-[#051424] p-2 rounded border border-[#273647]">
                          <span class="text-[10px] text-[#bec6e0] block">UNIT PRICE</span>
                          <strong class="text-emerald-400">${popular.price}</strong>
                        </div>
                        <div class="bg-[#051424] p-2 rounded border border-[#273647]">
                          <span class="text-[10px] text-[#bec6e0] block">LEAD TIME</span>
                          <strong class="text-emerald-400">${popular.leadTime}</strong>
                        </div>
                        <div class="bg-[#051424] p-2 rounded border border-[#273647]">
                          <span class="text-[10px] text-[#bec6e0] block">TRUST SCORE</span>
                          <strong class="text-emerald-400">${popular.trustScore}/100</strong>
                        </div>
                      </div>

                      <p class="text-[11px] text-[#d4e4fa] leading-snug">
                        ${popular.description} <strong class="text-emerald-300 block mt-1">✨ ${popular.savingsVsIncumbent || 'Highest Net Margin & Faster Delivery'}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Bottom Action Row -->
                <div class="pt-4 border-t border-[#273647] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div class="flex items-center gap-2 mono text-xs text-[#bec6e0]">
                    <span>Selected Supplier:</span>
                    <strong class="text-white">${activeVendor.name}</strong>
                    <span class="text-emerald-400">(${activeVendor.price} &bull; Total: ${activeVendor.totalCost || '₹15,720'})</span>
                  </div>

                  <div class="flex items-center gap-3">
                    <button onclick="window.askCopilotPrompt('Break down the historical profit/loss telemetry and supplier comparison calculations for ${rec.title}.')" class="px-3.5 py-2.5 rounded-xl bg-[#122131] hover:bg-[#1c2b3c] border border-[#273647] text-[#bec6e0] hover:text-white font-mono text-xs transition-colors">
                      Audit Calculations
                    </button>
                    <button onclick="window.SupplyChainActions.acceptAiRecommendation('${rec.id}')" class="px-5 py-2.5 rounded-xl bg-[#ff5c35] hover:bg-[#b52701] text-white font-bold text-xs geist flex items-center gap-2 shadow-lg shadow-[#ff5c35]/30 active:scale-95 transition-all">
                      <span class="material-symbols-outlined text-base">check_circle</span>
                      <span>Accept & Draft PO with ${activeVendor.name.split(' ')[0]}</span>
                    </button>
                  </div>
                </div>

              </div>
            `;
          }).join('')}
        </div>
      `;
    };

    window.renderAiInsightsPage();
  }

  // --- 11. RESTOCK APPROVAL PAGE ---
  function initRestockApprovalPage() {
    window.renderApprovalsPage = function () {
      const approvals = window.SupplyChainState.get('approvals') || [];
      const container = document.querySelector('.space-y-6');

      if (!container) return;

      if (approvals.length === 0) {
        container.innerHTML = `
          <div class="bg-[#0d1c2d] border border-[#273647] rounded-2xl p-12 text-center text-[#bec6e0] max-w-2xl mx-auto my-8">
            <span class="material-symbols-outlined text-6xl text-[#7bd0ff] mb-4">check_circle</span>
            <h3 class="text-xl font-bold text-white mb-2">All Restock Authorizations Cleared</h3>
            <p class="text-sm text-[#bec6e0] mb-6">There are currently no pending purchase orders requiring executive sign-off.</p>
            <a href="dashboard.html" class="inline-flex items-center gap-2 px-4 py-2 bg-[#1c2b3c] hover:bg-[#273647] text-white rounded-lg text-sm transition-colors">
              <span class="material-symbols-outlined text-sm">dashboard</span> Return to Dashboard
            </a>
          </div>
        `;
        return;
      }

      container.innerHTML = approvals.map(apv => `
        <div class="bg-surface rounded-2xl border border-primary/40 p-6 md:p-8 shadow-2xl space-y-6 font-['Inter',sans-serif]">
          <div class="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-outline-variant/30 pb-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="px-3 py-1 rounded-full bg-error-container/40 text-error text-xs font-mono font-bold">${(apv.urgency || 'CRITICAL').toUpperCase()} RESTOCK PO</span>
                <span class="text-xs font-mono text-secondary">${apv.poNumber} &bull; Auto-Generated AI Authorization</span>
              </div>
              <h2 class="text-xl md:text-2xl font-bold text-white font-['Geist',sans-serif]">${apv.item} (${apv.qty} Units)</h2>
              <p class="text-xs text-secondary mt-1">Supplier: <strong class="text-tertiary">${apv.supplier}</strong> &bull; SKU: <span class="font-mono text-tertiary">${apv.sku}</span></p>
            </div>

            <div class="text-right sm:border-l sm:border-outline-variant/30 sm:pl-6">
              <span class="text-xs font-mono text-secondary uppercase block">Total PO Value</span>
              <div class="text-3xl font-extrabold font-mono text-primary">${apv.totalCost}</div>
              <span class="text-[11px] text-tertiary font-mono">Unit Price: ${apv.unitPrice}</span>
            </div>
          </div>

          <!-- AI Justification & Impact -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30">
              <div class="flex items-center gap-2 text-tertiary text-xs font-bold font-mono mb-2">
                <span class="material-symbols-outlined text-sm">psychology</span>
                <span>AI FORECAST JUSTIFICATION</span>
              </div>
              <p class="text-xs text-on-surface leading-relaxed">
                ${apv.reason}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30">
              <div class="flex items-center gap-2 text-primary text-xs font-bold font-mono mb-2">
                <span class="material-symbols-outlined text-sm">price_check</span>
                <span>ERP & FINANCIAL IMPACT</span>
              </div>
              <p class="text-xs text-on-surface leading-relaxed">
                ${apv.financialImpact}. Approving transmits EDI order directly to <strong>${apv.supplier}</strong> cold-chain logistics.
              </p>
            </div>
          </div>

          <!-- Multi-Vendor Quote Analysis -->
          <div>
            <h4 class="font-bold text-sm text-white font-['Geist',sans-serif] mb-3">Multi-Vendor Quote Analysis</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-outline-variant/30 text-secondary font-mono">
                    <th class="py-2">VENDOR</th>
                    <th class="py-2">UNIT PRICE</th>
                    <th class="py-2">LEAD TIME</th>
                    <th class="py-2">AI RELIABILITY</th>
                    <th class="py-2">STATUS</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/20">
                  ${(apv.quotes || [
                    { vendor: apv.supplier + ' (Preferred)', price: apv.unitPrice, leadTime: '3 Days', reliability: '99.4%', selected: true }
                  ]).map(q => `
                    <tr class="${q.selected ? 'bg-primary-container/10' : 'opacity-60'}">
                      <td class="py-3 font-bold text-white flex items-center gap-1.5">
                        ${q.selected ? '<span class="material-symbols-outlined text-sm text-primary">verified</span>' : ''}
                        ${q.vendor}
                      </td>
                      <td class="py-3 font-mono text-white">${q.price}</td>
                      <td class="py-3 font-mono text-tertiary">${q.leadTime}</td>
                      <td class="py-3 font-mono text-tertiary font-bold">${q.reliability}</td>
                      <td class="py-3"><span class="px-2 py-0.5 rounded-full ${q.selected ? 'bg-primary-container/20 text-primary' : 'bg-surface-container-high text-secondary'} font-mono text-[10px]">${q.selected ? 'SELECTED FOR DISPATCH' : 'ALTERNATE'}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Executive Action Buttons -->
          <div class="pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-2 text-xs font-mono text-tertiary">
              <span class="material-symbols-outlined text-sm">security</span>
              <span>AI Executive Signature Ready (Confidence: ${apv.confidenceScore || '99.4%'})</span>
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button onclick="window.SupplyChainActions.rejectRestockPo('${apv.id}')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-outline-variant/50 text-secondary hover:text-white font-mono text-xs hover:border-error transition-colors">
                Reject & Archive
              </button>
              <button onclick="window.SupplyChainActions.approveRestockPo('${apv.id}')" class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-extrabold text-xs hover:bg-inverse-primary transition-all shadow-[0_0_15px_rgba(255,92,53,0.3)] flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">verified</span>
                <span>Authorize PO & Transmit to ${apv.supplier}</span>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    };
    window.renderApprovalsPage();
  }


  // --- 12. DASHBOARD PAGE ---
  function initDashboardPage() {
    const kpi = window.SupplyChainState.get('kpi') || {};
    const orderCountEl = document.querySelector('.font-display-lg');
    if (orderCountEl && kpi.todayOrders) {
      orderCountEl.textContent = kpi.todayOrders.toLocaleString();
    }
  }

  // --- 13. USER PROFILE MANAGEMENT PAGE ---
  function initProfilePage() {
    const user = window.SupplyChainState.get('user') || DEFAULT_STATE.user;
    
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const roleInput = document.getElementById('profile-role');
    const deptInput = document.getElementById('profile-dept');
    const previewAvatar = document.getElementById('profile-preview-avatar');
    const cardName = document.getElementById('profile-card-name');
    const cardRole = document.getElementById('profile-card-role');
    const cardEmail = document.getElementById('profile-card-email');
    const fileInput = document.getElementById('avatar-file-input');

    if (nameInput && user.name) nameInput.value = user.name;
    if (emailInput && user.email) emailInput.value = user.email;
    if (phoneInput && user.phone) phoneInput.value = user.phone;
    if (roleInput && user.role) roleInput.value = user.role;
    if (deptInput && user.dept) deptInput.value = user.dept;
    if (cardName && user.name) cardName.textContent = user.name;
    if (cardRole && user.role) cardRole.textContent = user.role;
    if (cardEmail && user.email) cardEmail.textContent = user.email;
    if (previewAvatar && user.avatar) previewAvatar.src = user.avatar;

    // File input listener for photo change
    if (fileInput) {
      fileInput.addEventListener('change', function (e) {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (evt) {
            const base64Url = evt.target.result;
            if (previewAvatar) previewAvatar.src = base64Url;
            const currentUser = window.SupplyChainState.get('user') || DEFAULT_STATE.user;
            currentUser.avatar = base64Url;
            window.SupplyChainState.set('user', currentUser);
            syncUserHeaders();
            window.showToast('Profile Photo Updated', 'Your profile picture has been updated across the platform.', 'success');
            
            // Sync with backend API
            fetch('/api/auth/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ avatar: base64Url })
            }).catch(err => console.log('Backend sync note:', err));
          };
          reader.readAsDataURL(file);
        }
      });
    }

    window.selectPresetAvatar = function(url) {
      if (previewAvatar) previewAvatar.src = url;
      const currentUser = window.SupplyChainState.get('user') || DEFAULT_STATE.user;
      currentUser.avatar = url;
      window.SupplyChainState.set('user', currentUser);
      syncUserHeaders();
      window.showToast('Avatar Preset Applied', 'Executive avatar selected.', 'success');
      
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: url })
      }).catch(err => console.log('Backend sync note:', err));
    };

    window.applyAvatarUrl = function() {
      const urlInput = document.getElementById('custom-avatar-url');
      const url = urlInput ? urlInput.value.trim() : '';
      if (!url) {
        window.showToast('URL Required', 'Please enter a valid image URL.', 'alert');
        return;
      }
      if (previewAvatar) previewAvatar.src = url;
      const currentUser = window.SupplyChainState.get('user') || DEFAULT_STATE.user;
      currentUser.avatar = url;
      window.SupplyChainState.set('user', currentUser);
      syncUserHeaders();
      window.showToast('Avatar URL Applied', 'Custom image URL applied.', 'success');
      
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: url })
      }).catch(err => console.log('Backend sync note:', err));
    };

    window.handleProfileSave = function(forceConfirm) {
      const currentStored = window.SupplyChainState.get('user') || DEFAULT_STATE.user;
      const newName = nameInput ? nameInput.value.trim() : currentStored.name;
      const newEmail = emailInput ? emailInput.value.trim() : currentStored.email;
      const newPhone = phoneInput ? phoneInput.value.trim() : currentStored.phone;
      const newRole = roleInput ? roleInput.value.trim() : currentStored.role;
      const newDept = deptInput ? deptInput.value.trim() : (currentStored.dept || 'Global Autonomous Supply Logistics (ORD-3)');
      const currentAvatar = previewAvatar ? previewAvatar.src : currentStored.avatar;

      if (!newName || !newEmail || !newPhone) {
        window.showToast('Required Fields Missing', 'Please fill in Name, Phone, and Email.', 'alert');
        return;
      }

      const emailChanged = (newEmail.toLowerCase() !== currentStored.email.toLowerCase());

      if (forceConfirm || emailChanged) {
        const emailTextEl = document.getElementById('confirm-modal-email-text');
        if (emailTextEl) emailTextEl.textContent = newEmail;
        const modal = document.getElementById('modal-email-confirmation');
        if (modal) {
          modal.classList.replace('hidden', 'flex');
        }
      } else {
        const updatedUser = {
          ...currentStored,
          name: newName,
          email: newEmail,
          phone: newPhone,
          role: newRole,
          dept: newDept,
          avatar: currentAvatar
        };
        window.SupplyChainState.set('user', updatedUser);
        if (cardName) cardName.textContent = newName;
        if (cardRole) cardRole.textContent = newRole;
        if (cardEmail) cardEmail.textContent = newEmail;
        syncUserHeaders();
        
        fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser)
        }).catch(err => console.log('Backend sync note:', err));

        window.showToast('Profile Saved', 'Your user information and phone number have been updated.', 'success');
      }
    };

    window.finalizeEmailConfirmation = function() {
      const currentStored = window.SupplyChainState.get('user') || DEFAULT_STATE.user;
      const newName = nameInput ? nameInput.value.trim() : currentStored.name;
      const newEmail = emailInput ? emailInput.value.trim() : currentStored.email;
      const newPhone = phoneInput ? phoneInput.value.trim() : currentStored.phone;
      const newRole = roleInput ? roleInput.value.trim() : currentStored.role;
      const newDept = deptInput ? deptInput.value.trim() : (currentStored.dept || 'Global Autonomous Supply Logistics (ORD-3)');
      const currentAvatar = previewAvatar ? previewAvatar.src : currentStored.avatar;

      const updatedUser = {
        ...currentStored,
        name: newName,
        email: newEmail,
        phone: newPhone,
        role: newRole,
        dept: newDept,
        avatar: currentAvatar,
        authenticated: false
      };

      window.SupplyChainState.set('user', updatedUser);
      
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      }).catch(err => console.log('Backend sync note:', err));

      const modal = document.getElementById('modal-email-confirmation');
      if (modal) modal.classList.replace('flex', 'hidden');

      window.showToast('Email Confirmed', 'Redirecting to Authentication Gateway to verify credentials...', 'success');

      setTimeout(() => {
        window.location.href = `index.html?email_updated=true&new_email=${encodeURIComponent(newEmail)}&name=${encodeURIComponent(newName)}`;
      }, 900);
    };
  }

  window.initProfilePageLogic = initProfilePage;

  // --- 11. INTERACTIVE USER ONBOARDING & GUIDES (MOBILE & DESKTOP) ---
  function injectGlobalUserGuide() {
    if (document.getElementById('sc-user-guide-modal')) return;

    // 1. Floating Help / Quick Guide Button
    const btn = document.createElement('button');
    btn.id = 'sc-guide-trigger-btn';
    btn.className = 'fixed bottom-6 left-6 z-[9990] flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#122131]/90 hover:bg-[#1c2b3c] border border-[#ff5c35]/40 text-[#d4e4fa] hover:text-white text-xs font-bold shadow-xl shadow-[#ff5c35]/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer';
    btn.innerHTML = `
      <span class="material-symbols-outlined text-[#ff5c35] text-lg animate-pulse">help_outline</span>
      <span class="hidden sm:inline">Platform Guide</span>
      <span class="inline sm:hidden">Guide</span>
    `;
    btn.onclick = () => window.openUserGuideModal();
    document.body.appendChild(btn);

    // 2. Interactive Guide Modal Container
    const modal = document.createElement('div');
    modal.id = 'sc-user-guide-modal';
    modal.className = 'fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md hidden items-center justify-center p-4 overflow-y-auto animate-fade-in';
    modal.innerHTML = `
      <div class="relative w-full max-w-3xl bg-[#0b1622] border border-[#273647] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="p-5 border-b border-[#273647] flex items-center justify-between bg-[#122131]/60">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#ff5c35]/20 border border-[#ff5c35]/40 flex items-center justify-center text-[#ff5c35]">
              <span class="material-symbols-outlined text-xl">menu_book</span>
            </div>
            <div>
              <h3 class="text-lg font-black text-white geist tracking-wide flex items-center gap-2">
                SupplyChain.AI — Interactive User Guide
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#ff5c35]/20 text-[#ff5c35] font-mono font-bold">Mobile & Desktop</span>
              </h3>
              <p class="text-xs text-[#8992a8]">Step-by-step walkthrough to master platform workflows on any screen.</p>
            </div>
          </div>
          <button onclick="window.closeUserGuideModal()" class="p-1.5 rounded-lg text-[#8992a8] hover:text-white hover:bg-[#1c2b3c] transition-colors">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-b border-[#273647] bg-[#0d1c2d] px-4 gap-2 overflow-x-auto">
          <button id="guide-tab-btn-desktop" onclick="window.switchGuideTab('desktop')" class="py-3 px-4 text-xs font-bold text-[#ff5c35] border-b-2 border-[#ff5c35] flex items-center gap-1.5 whitespace-nowrap transition-all">
            <span class="material-symbols-outlined text-base">laptop_mac</span> 💻 Desktop Experience
          </button>
          <button id="guide-tab-btn-mobile" onclick="window.switchGuideTab('mobile')" class="py-3 px-4 text-xs font-bold text-[#8992a8] border-b-2 border-transparent hover:text-white flex items-center gap-1.5 whitespace-nowrap transition-all">
            <span class="material-symbols-outlined text-base">smartphone</span> 📱 Mobile Experience
          </button>
          <button id="guide-tab-btn-workflows" onclick="window.switchGuideTab('workflows')" class="py-3 px-4 text-xs font-bold text-[#8992a8] border-b-2 border-transparent hover:text-white flex items-center gap-1.5 whitespace-nowrap transition-all">
            <span class="material-symbols-outlined text-base">bolt</span> ⚡ Key Workflows
          </button>
        </div>

        <!-- Tab Content Body -->
        <div class="p-6 overflow-y-auto space-y-6 text-[#d4e4fa] text-xs leading-relaxed flex-1">
          
          <!-- TAB 1: DESKTOP -->
          <div id="guide-content-desktop" class="space-y-4">
            <div class="bg-[#122131]/70 border border-[#273647] rounded-xl p-4 space-y-2">
              <h4 class="text-sm font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[#ff5c35] text-base">desktop_windows</span>
                Desktop Interface Navigation
              </h4>
              <p class="text-[#bec6e0]">Navigate using the sticky left sidebar for instant jumping between core command portals:</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div class="bg-[#0b1622] p-3 rounded-lg border border-[#273647]">
                  <strong class="text-white flex items-center gap-1.5"><span class="material-symbols-outlined text-[#7bd0ff] text-sm">dashboard</span> Executive Dashboard</strong>
                  <p class="text-[11px] text-[#8992a8] mt-1">High-level KPI telemetry in ₹ INR, in-transit cargo, and real-time logistics map node hotspots.</p>
                </div>
                <div class="bg-[#0b1622] p-3 rounded-lg border border-[#273647]">
                  <strong class="text-white flex items-center gap-1.5"><span class="material-symbols-outlined text-[#ff5c35] text-sm">psychology</span> AI Demand Insights</strong>
                  <p class="text-[11px] text-[#8992a8] mt-1">Historical 90-day velocity telemetry, Profit vs Loss forecast, and Incumbent vs Trusted vendor switching.</p>
                </div>
                <div class="bg-[#0b1622] p-3 rounded-lg border border-[#273647]">
                  <strong class="text-white flex items-center gap-1.5"><span class="material-symbols-outlined text-emerald-400 text-sm">inventory_2</span> Inventory & Stockout</strong>
                  <p class="text-[11px] text-[#8992a8] mt-1">Multi-hub warehouse balances. Click <code class="text-white bg-[#1c2b3c] px-1 py-0.5 rounded">Restock</code> to trigger 1-click PO drafts.</p>
                </div>
                <div class="bg-[#0b1622] p-3 rounded-lg border border-[#273647]">
                  <strong class="text-white flex items-center gap-1.5"><span class="material-symbols-outlined text-purple-400 text-sm">account_balance_wallet</span> Payments & Escrow</strong>
                  <p class="text-[11px] text-[#8992a8] mt-1">Multi-rail Razorpay settlement ledger, milestone escrow fund locking & automated release.</p>
                </div>
              </div>
            </div>

            <div class="bg-[#122131]/70 border border-[#273647] rounded-xl p-4">
              <h5 class="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-amber-400 text-sm">keyboard</span>
                Pro Tips for Desktop Power Users:
              </h5>
              <ul class="list-disc list-inside space-y-1.5 text-[#bec6e0]">
                <li>Click the <strong>Copilot Pill</strong> on the right to open the Gemini RAG AI Chatbot anytime.</li>
                <li>Click your <strong>Avatar</strong> in the top right to customize your photo, phone number, and sync with Supabase.</li>
                <li>Hover over waypoints on the global logistics map to inspect active cargo status.</li>
              </ul>
            </div>
          </div>

          <!-- TAB 2: MOBILE -->
          <div id="guide-content-mobile" class="hidden space-y-4">
            <div class="bg-[#122131]/70 border border-[#273647] rounded-xl p-4 space-y-3">
              <h4 class="text-sm font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[#ff5c35] text-base">touch_app</span>
                Mobile Touch & Gesture Controls
              </h4>
              <p class="text-[#bec6e0]">Designed with bottom-accessible touch targets and responsive drawers:</p>
              
              <div class="space-y-2">
                <div class="flex items-start gap-3 bg-[#0b1622] p-3 rounded-lg border border-[#273647]">
                  <span class="w-6 h-6 rounded-full bg-[#ff5c35]/20 text-[#ff5c35] flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <strong class="text-white">Bottom Navigation Bar</strong>
                    <p class="text-[11px] text-[#8992a8] mt-0.5">Quickly switch between Dashboard, Orders, Inventory, and Approvals without stretching your thumb.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 bg-[#0b1622] p-3 rounded-lg border border-[#273647]">
                  <span class="w-6 h-6 rounded-full bg-[#ff5c35]/20 text-[#ff5c35] flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <strong class="text-white">Hamburger Menu (Top Left)</strong>
                    <p class="text-[11px] text-[#8992a8] mt-0.5">Tap the menu icon to open the full navigation drawer, access Profile settings, and view Supplier scorecards.</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 bg-[#0b1622] p-3 rounded-lg border border-[#273647]">
                  <span class="w-6 h-6 rounded-full bg-[#ff5c35]/20 text-[#ff5c35] flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <strong class="text-white">Swipeable Vendor Cards</strong>
                    <p class="text-[11px] text-[#8992a8] mt-0.5">On the AI Demand Insights page, tap either vendor radio card to instantly switch suppliers before drafting your restock PO.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: CORE WORKFLOWS -->
          <div id="guide-content-workflows" class="hidden space-y-4">
            <div class="bg-[#122131]/70 border border-[#273647] rounded-xl p-4 space-y-3">
              <h4 class="text-sm font-bold text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-[#ff5c35] text-base">account_tree</span>
                End-to-End Autonomous Sourcing Cycle
              </h4>
              
              <div class="space-y-3">
                <div class="p-3 rounded-lg bg-[#0b1622] border border-[#273647] flex items-start gap-3">
                  <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold shrink-0 mt-0.5">STEP 1</span>
                  <div>
                    <strong class="text-white">AI Surge Detection & Vendor Choice</strong>
                    <p class="text-[11px] text-[#8992a8] mt-0.5">Go to <a href="ai-insights.html" class="text-[#ff5c35] underline font-bold">AI Demand Insights</a>. Review the 90-day purchase pattern, verify projected profit (+₹42,800), and choose between Incumbent vs Top-Rated Partner.</p>
                  </div>
                </div>

                <div class="p-3 rounded-lg bg-[#0b1622] border border-[#273647] flex items-start gap-3">
                  <span class="px-2 py-0.5 rounded bg-[#ff5c35]/20 text-[#ff5c35] font-mono text-[10px] font-bold shrink-0 mt-0.5">STEP 2</span>
                  <div>
                    <strong class="text-white">1-Click Restock PO Drafting</strong>
                    <p class="text-[11px] text-[#8992a8] mt-0.5">Click <strong>"Accept & Draft PO"</strong>. The PO is generated with the selected vendor's unit pricing and sent to the Restock Authorization Desk.</p>
                  </div>
                </div>

                <div class="p-3 rounded-lg bg-[#0b1622] border border-[#273647] flex items-start gap-3">
                  <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono text-[10px] font-bold shrink-0 mt-0.5">STEP 3</span>
                  <div>
                    <strong class="text-white">Executive Authorization & Escrow Lock</strong>
                    <p class="text-[11px] text-[#8992a8] mt-0.5">In <a href="restock-approval.html" class="text-[#ff5c35] underline font-bold">Restock Approvals</a>, authorize the order. Funds lock safely in milestone escrow in <a href="payments.html" class="text-[#ff5c35] underline font-bold">Payments</a> until verified receipt.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-[#273647] bg-[#122131]/60 flex items-center justify-between">
          <div class="text-[11px] text-[#8992a8]">
            Currency: <span class="text-white font-mono font-bold">₹ INR</span> | Synced with <span class="text-white font-mono font-bold">Supabase</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.closeUserGuideModal()" class="px-4 py-2 rounded-xl bg-[#ff5c35] hover:bg-[#b52701] text-white font-bold text-xs transition-all shadow-md">
              Got It, Let's Go!
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    window.openUserGuideModal = function() {
      modal.classList.replace('hidden', 'flex');
    };

    window.closeUserGuideModal = function() {
      modal.classList.replace('flex', 'hidden');
      localStorage.setItem('sc_guide_viewed', 'true');
    };

    window.switchGuideTab = function(tabKey) {
      ['desktop', 'mobile', 'workflows'].forEach(k => {
        const btnEl = document.getElementById(`guide-tab-btn-${k}`);
        const contentEl = document.getElementById(`guide-content-${k}`);
        if (k === tabKey) {
          if (btnEl) {
            btnEl.className = 'py-3 px-4 text-xs font-bold text-[#ff5c35] border-b-2 border-[#ff5c35] flex items-center gap-1.5 whitespace-nowrap transition-all';
          }
          if (contentEl) contentEl.classList.remove('hidden');
        } else {
          if (btnEl) {
            btnEl.className = 'py-3 px-4 text-xs font-bold text-[#8992a8] border-b-2 border-transparent hover:text-white flex items-center gap-1.5 whitespace-nowrap transition-all';
          }
          if (contentEl) contentEl.classList.add('hidden');
        }
      });
    };
  }

  // --- 12. LOW STOCK ALERT & NOTIFICATION SYSTEM ---
  let alertPollingInterval = null;

  async function fetchUnreadAlerts() {
    try {
      const apiBase = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';
      const res = await fetch(`${apiBase}/api/inventory/alerts/unread`);
      if (res.ok) {
        const data = await res.json();
        updateNotificationBellBadge(data);
        return data;
      }
    } catch (e) {
      console.log('Unread alerts fetch note:', e);
    }
    return null;
  }

  function updateNotificationBellBadge(summary) {
    const count = summary ? summary.unread_count : 0;
    const hasCritical = summary ? summary.has_critical : false;

    document.querySelectorAll('button[title="Notifications"], .sc-notif-bell-btn').forEach(btn => {
      let badge = btn.querySelector('.sc-notif-badge');
      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'sc-notif-badge absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[10px] font-bold text-white font-mono shadow-md';
          btn.style.position = 'relative';
          btn.appendChild(badge);
        }
        badge.textContent = count > 9 ? '9+' : count;
        if (hasCritical) {
          badge.className = 'sc-notif-badge absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[10px] font-bold text-white font-mono shadow-md bg-rose-600 animate-pulse border border-rose-400';
        } else {
          badge.className = 'sc-notif-badge absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[10px] font-bold text-white font-mono shadow-md bg-amber-500 border border-amber-300';
        }
      } else if (badge) {
        badge.remove();
      }
    });
  }

  function injectNotificationCenterPanel() {
    if (document.getElementById('sc-notifications-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'sc-notifications-panel';
    panel.className = 'fixed top-20 right-4 md:right-8 w-96 max-w-[calc(100vw-2rem)] z-[9995] bg-[#0b1622]/95 border border-[#273647] rounded-2xl shadow-2xl backdrop-blur-xl hidden flex-col overflow-hidden animate-fade-in max-h-[80vh]';
    panel.innerHTML = `
      <!-- Panel Header -->
      <div class="p-4 border-b border-[#273647] bg-[#122131]/80 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="material-symbols-outlined text-[#ff5c35] text-xl" style="font-variation-settings: 'FILL' 1;">notifications_active</span>
          <div>
            <h3 class="text-sm font-black text-white geist">Supply Chain Alert Center</h3>
            <p class="text-[10px] text-[#8992a8]">Live inventory threshold & autonomous email alerts</p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button onclick="window.refreshAlertsPanel()" class="p-1 rounded-lg text-[#8992a8] hover:text-white hover:bg-[#1c2b3c] transition-colors" title="Scan Inventory Now">
            <span class="material-symbols-outlined text-sm">sync</span>
          </button>
          <button onclick="window.toggleNotificationPanel()" class="p-1 rounded-lg text-[#8992a8] hover:text-white hover:bg-[#1c2b3c] transition-colors">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex border-b border-[#273647] bg-[#0d1c2d] px-3 gap-2 text-xs">
        <button id="sc-notif-tab-unread" onclick="window.filterNotifTab('unread')" class="py-2.5 px-3 font-bold text-[#ff5c35] border-b-2 border-[#ff5c35] transition-all">
          Active Alerts (<span id="sc-notif-active-count">0</span>)
        </button>
        <button id="sc-notif-tab-all" onclick="window.filterNotifTab('all')" class="py-2.5 px-3 font-bold text-[#8992a8] border-b-2 border-transparent hover:text-white transition-all">
          History
        </button>
      </div>

      <!-- Alerts List Body -->
      <div id="sc-notif-list-container" class="p-3 overflow-y-auto space-y-2.5 flex-1 divide-y divide-[#273647]/40">
        <div class="p-6 text-center text-[#8992a8] text-xs">
          <span class="material-symbols-outlined text-2xl text-emerald-400 mb-1">verified</span>
          <p>Scanning inventory telemetry...</p>
        </div>
      </div>

      <!-- Panel Footer -->
      <div class="p-3 border-t border-[#273647] bg-[#122131]/60 flex items-center justify-between text-[11px]">
        <button onclick="window.refreshAlertsPanel()" class="px-2.5 py-1.5 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#7bd0ff] border border-[#273647] font-bold text-[10px] flex items-center gap-1.5 active:scale-95 transition-all">
          <span class="material-symbols-outlined text-xs">sync</span>
          <span>Scan Inventory Now</span>
        </button>
        <a href="inventory.html" class="text-xs text-[#7bd0ff] hover:underline font-bold">Inspect Inventory &rarr;</a>
      </div>
    `;

    document.body.appendChild(panel);

    // Bind click to notification bell buttons
    document.querySelectorAll('button[title="Notifications"], .sc-notif-bell-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        window.toggleNotificationPanel();
      };
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (panel && !panel.contains(e.target) && !e.target.closest('button[title="Notifications"]') && !e.target.closest('.sc-notif-bell-btn')) {
        panel.classList.replace('flex', 'hidden');
      }
    });

    window.toggleNotificationPanel = function() {
      if (panel.classList.contains('hidden')) {
        panel.classList.replace('hidden', 'flex');
        window.renderAlertsList();
      } else {
        panel.classList.replace('flex', 'hidden');
      }
    };

    window.filterNotifTab = function(tab) {
      const tabUnread = document.getElementById('sc-notif-tab-unread');
      const tabAll = document.getElementById('sc-notif-tab-all');
      if (tab === 'unread') {
        if (tabUnread) tabUnread.className = 'py-2.5 px-3 font-bold text-[#ff5c35] border-b-2 border-[#ff5c35] transition-all';
        if (tabAll) tabAll.className = 'py-2.5 px-3 font-bold text-[#8992a8] border-b-2 border-transparent hover:text-white transition-all';
        window.renderAlertsList(false);
      } else {
        if (tabAll) tabAll.className = 'py-2.5 px-3 font-bold text-[#ff5c35] border-b-2 border-[#ff5c35] transition-all';
        if (tabUnread) tabUnread.className = 'py-2.5 px-3 font-bold text-[#8992a8] border-b-2 border-transparent hover:text-white transition-all';
        window.renderAlertsList(true);
      }
    };

    window.refreshAlertsPanel = async function() {
      try {
        const apiBase = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';
        window.showToast('Scanning Telemetry', 'Checking inventory records against safety stock thresholds...', 'ai');
        const res = await fetch(`${apiBase}/api/inventory/check-stock`, { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          window.renderAlertsList();
          fetchUnreadAlerts();
          if (data.alerts_created > 0) {
            window.showToast('Inventory Alert', `${data.alerts_created} low/critical stock alerts generated and logged.`, 'error');
          } else {
            window.showToast('Scan Complete', `All ${data.total_scanned} inventory SKUs evaluated.`, 'success');
          }
        }
      } catch (e) {
        console.error('Scan error:', e);
      }
    };

    window.renderAlertsList = async function(showHistory = false) {
      const container = document.getElementById('sc-notif-list-container');
      if (!container) return;

      try {
        const apiBase = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';
        const url = showHistory ? `${apiBase}/api/inventory/alerts?unresolved_only=false` : `${apiBase}/api/inventory/alerts?unresolved_only=true`;
        const res = await fetch(url);
        if (res.ok) {
          const alerts = await res.json();
          const activeCountEl = document.getElementById('sc-notif-active-count');
          if (activeCountEl && !showHistory) activeCountEl.textContent = alerts.length;

          if (alerts.length === 0) {
            container.innerHTML = `
              <div class="p-8 text-center text-[#8992a8] space-y-2">
                <span class="material-symbols-outlined text-3xl text-emerald-400">check_circle</span>
                <p class="text-xs text-white font-bold">All Inventory Buffers Optimal</p>
                <p class="text-[11px]">No active stockout warnings detected.</p>
              </div>
            `;
            return;
          }

          container.innerHTML = alerts.map(a => {
            const isCritical = a.severity === 'CRITICAL';
            const icon = isCritical ? 'emergency' : 'warning';
            const badgeBg = isCritical ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40';
            const emailBadge = a.email_sent 
              ? `<span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono">📧 Email Dispatched</span>`
              : `<span class="px-1.5 py-0.5 rounded bg-[#1c2b3c] text-[#8992a8] border border-[#273647] text-[9px] font-mono">📧 Logged (Demo Mode)</span>`;

            return `
              <div class="pt-3 first:pt-0 space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-sm ${isCritical ? 'text-rose-400 animate-pulse' : 'text-amber-400'}">${icon}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${badgeBg}">${a.severity} STOCK</span>
                  </div>
                  <div class="flex items-center gap-1">
                    ${emailBadge}
                    <button onclick="window.dismissAlert('${a.id}')" class="text-[#8992a8] hover:text-white p-0.5 rounded" title="Dismiss">
                      <span class="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 class="text-xs font-bold text-white leading-tight">${a.product_name}</h4>
                  <div class="flex items-center gap-2 text-[10px] text-[#8992a8] font-mono mt-0.5">
                    <span>${a.sku}</span>
                    <span>•</span>
                    <span>${a.warehouse}</span>
                  </div>
                </div>

                <div class="p-2 rounded-lg bg-[#0d1c2d] border border-[#273647] flex justify-between items-center text-[11px]">
                  <div>
                    <span class="text-[#8992a8]">Stock:</span>
                    <strong class="${isCritical ? 'text-rose-400' : 'text-amber-400'} font-mono">${a.current_stock}</strong>
                    <span class="text-[#8992a8]">/ ${a.reorder_point}</span>
                  </div>
                  ${a.ai_recommendation ? `<span class="text-[10px] text-[#7bd0ff] font-mono">~${a.ai_recommendation.days_until_stockout || 1.5}d buffer</span>` : ''}
                </div>

                <div class="flex items-center gap-2 pt-1">
                  <button onclick="window.openAiRestockModal('${a.sku}', '${a.id}')" class="flex-1 py-1.5 px-2 rounded-lg bg-[#ff5c35] hover:bg-[#b52701] text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-xs">psychology</span>
                    <span>Review AI Restock</span>
                  </button>
                  <a href="inventory.html" class="py-1.5 px-2 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#bec6e0] hover:text-white text-[11px] font-bold transition-all">
                    Inventory
                  </a>
                </div>
              </div>
            `;
          }).join('');
        }
      } catch (e) {
        console.error('Error rendering alerts:', e);
      }
    };

    window.dismissAlert = async function(alertId) {
      try {
        const apiBase = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';
        await fetch(`${apiBase}/api/inventory/alerts/${alertId}/read`, { method: 'POST' });
        window.renderAlertsList();
        fetchUnreadAlerts();
      } catch (e) {
        console.error('Dismiss error:', e);
      }
    };
  }

  // --- 13. AI RESTOCK PROPOSAL MODAL (HUMAN-IN-THE-LOOP SAFEGUARD) ---
  function injectAiRestockModal() {
    if (document.getElementById('sc-ai-restock-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'sc-ai-restock-modal';
    modal.className = 'fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md hidden items-center justify-center p-4 overflow-y-auto animate-fade-in';
    modal.innerHTML = `
      <div class="relative w-full max-w-xl bg-[#0b1622] border border-[#273647] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="p-5 border-b border-[#273647] bg-[#122131]/80 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#ff5c35]/20 border border-[#ff5c35]/40 flex items-center justify-center text-[#ff5c35]">
              <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">psychology</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-black text-white geist">AI Restock Sourcing Proposal</h3>
                <span id="sc-modal-severity-badge" class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">CRITICAL</span>
              </div>
              <p class="text-xs text-[#8992a8]" id="sc-modal-sku-subtitle">SKU Analysis & Automated Replenishment Calculation</p>
            </div>
          </div>
          <button onclick="window.closeAiRestockModal()" class="p-1.5 rounded-lg text-[#8992a8] hover:text-white hover:bg-[#1c2b3c] transition-colors">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-5 text-xs text-[#d4e4fa]">
          <!-- Product Summary -->
          <div class="bg-[#122131] border border-[#273647] rounded-xl p-4 space-y-2">
            <h4 id="sc-modal-product-name" class="text-sm font-bold text-white">Fresh Hass Avocados (Box of 24)</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
              <div class="bg-[#0b1622] p-2 rounded-lg border border-[#273647]">
                <div class="text-[#8992a8]">Current Stock</div>
                <div id="sc-modal-curr-stock" class="text-rose-400 font-bold text-sm">18 Units</div>
              </div>
              <div class="bg-[#0b1622] p-2 rounded-lg border border-[#273647]">
                <div class="text-[#8992a8]">Safety Reorder</div>
                <div id="sc-modal-reorder-pt" class="text-white font-bold text-sm">350 Units</div>
              </div>
              <div class="bg-[#0b1622] p-2 rounded-lg border border-[#273647]">
                <div class="text-[#8992a8]">Coverage</div>
                <div id="sc-modal-days-left" class="text-amber-400 font-bold text-sm">~0.4 Days</div>
              </div>
              <div class="bg-[#0b1622] p-2 rounded-lg border border-[#273647]">
                <div class="text-[#8992a8]">Daily Demand</div>
                <div id="sc-modal-daily-demand" class="text-[#7bd0ff] font-bold text-sm">43.8/day</div>
              </div>
            </div>
          </div>

          <!-- AI Reasoning Card -->
          <div class="bg-[#1c2b3c]/60 border-l-4 border-[#ff5c35] p-4 rounded-r-xl space-y-1.5">
            <div class="font-bold text-[#ff5c35] flex items-center gap-1.5 text-xs">
              <span class="material-symbols-outlined text-sm">smart_toy</span>
              Neural Sourcing Diagnosis
            </div>
            <p id="sc-modal-ai-reasoning" class="text-[#d4e4fa] leading-relaxed text-xs">
              High stockout risk. Immediate replenishment recommended to maintain buffer.
            </p>
          </div>

          <!-- Restock Order Details (Editable) -->
          <div class="bg-[#122131] border border-[#273647] rounded-xl p-4 space-y-3">
            <h5 class="text-xs font-bold text-white flex items-center gap-1.5">
              <span class="material-symbols-outlined text-emerald-400 text-sm">local_shipping</span>
              Recommended Procurement Parameters
            </h5>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-[#8992a8] mb-1">Recommended Supplier</label>
                <div id="sc-modal-supplier-name" class="p-2.5 rounded-lg bg-[#0b1622] border border-[#273647] font-bold text-white text-xs">
                  Apex Organic Produce (99.4% OTIF)
                </div>
              </div>

              <div>
                <label class="block text-[11px] text-[#8992a8] mb-1">Restock Quantity (Units)</label>
                <div class="flex items-center gap-2">
                  <input id="sc-modal-qty-input" type="number" value="680" class="w-full p-2 rounded-lg bg-[#0b1622] border border-[#273647] font-mono text-white text-xs font-bold focus:border-[#ff5c35] focus:outline-none" oninput="window.recalcAiModalCost()" />
                </div>
              </div>
            </div>

            <div class="p-3 rounded-lg bg-[#0b1622] border border-[#273647] flex justify-between items-center text-xs font-mono">
              <span class="text-[#bec6e0]">Total Estimated PO Value:</span>
              <span id="sc-modal-total-cost" class="text-emerald-400 font-extrabold text-sm">₹19,040.00 INR</span>
            </div>
          </div>

          <!-- Human in the Loop Note -->
          <p class="text-[11px] text-center text-[#8992a8]">
            🔒 <em>Human Approval Step: Approving will draft a Purchase Order into Restock Authorizations. No payment is charged until authorized.</em>
          </p>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-[#273647] bg-[#122131]/80 flex items-center justify-between">
          <button onclick="window.closeAiRestockModal()" class="px-4 py-2 rounded-xl border border-[#273647] text-[#8992a8] hover:text-white text-xs font-bold transition-all">
            Dismiss / Reject
          </button>
          <div class="flex items-center gap-2">
            <button id="sc-modal-approve-btn" onclick="window.confirmAiRestockPo()" class="px-5 py-2.5 rounded-xl bg-[#ff5c35] hover:bg-[#b52701] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#ff5c35]/25 active:scale-95 transition-all">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>Approve Restock & Route to PO &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    let activeModalSku = null;
    let activeModalAlertId = null;
    let activeUnitCostNum = 28.00;

    window.openAiRestockModal = async function(sku, alertId) {
      activeModalSku = sku;
      activeModalAlertId = alertId;
      modal.classList.replace('hidden', 'flex');

      try {
        const apiBase = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';
        const res = await fetch(`${apiBase}/api/inventory/${sku}/restock-recommendation`, { method: 'POST' });
        if (res.ok) {
          const rec = await res.json();
          document.getElementById('sc-modal-product-name').textContent = rec.product_name;
          document.getElementById('sc-modal-sku-subtitle').textContent = `${rec.sku} • ${rec.warehouse}`;
          document.getElementById('sc-modal-curr-stock').textContent = `${rec.current_stock} Units`;
          document.getElementById('sc-modal-reorder-pt').textContent = `${rec.reorder_point} Units`;
          document.getElementById('sc-modal-days-left').textContent = `~${rec.days_until_stockout} Days`;
          document.getElementById('sc-modal-daily-demand').textContent = `${rec.average_daily_demand}/day`;
          document.getElementById('sc-modal-ai-reasoning').textContent = rec.ai_reasoning;
          document.getElementById('sc-modal-supplier-name').textContent = `${rec.recommended_supplier} (${rec.supplier_reliability} OTIF, ${rec.supplier_lead_time_days}-Day Lead)`;
          document.getElementById('sc-modal-qty-input').value = rec.recommended_quantity;

          try {
            activeUnitCostNum = parseFloat(rec.unit_price.replace(/[^0-9.]/g, '')) || 28.0;
          } catch (e) {
            activeUnitCostNum = 28.0;
          }

          window.recalcAiModalCost();

          const sevBadge = document.getElementById('sc-modal-severity-badge');
          if (sevBadge) {
            sevBadge.textContent = rec.severity;
            sevBadge.className = rec.severity === 'CRITICAL' 
              ? 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40';
          }
        }
      } catch (e) {
        console.error('Error fetching restock recommendation:', e);
      }
    };

    window.recalcAiModalCost = function() {
      const qtyInput = document.getElementById('sc-modal-qty-input');
      const costEl = document.getElementById('sc-modal-total-cost');
      const qty = parseInt(qtyInput ? qtyInput.value : 0) || 0;
      const total = qty * activeUnitCostNum;
      if (costEl) {
        costEl.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR`;
      }
    };

    window.closeAiRestockModal = function() {
      modal.classList.replace('flex', 'hidden');
    };

    window.confirmAiRestockPo = async function() {
      const qtyInput = document.getElementById('sc-modal-qty-input');
      const qty = parseInt(qtyInput ? qtyInput.value : 0) || 500;
      const totalCostStr = document.getElementById('sc-modal-total-cost').textContent;
      const productName = document.getElementById('sc-modal-product-name').textContent;

      // Create new approval PO in State
      const poNum = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newApproval = {
        id: `APV-${Date.now()}`,
        poNumber: poNum,
        sku: activeModalSku || 'SKU-RESTOCK',
        item: productName,
        qty: qty,
        totalCost: totalCostStr,
        unitPrice: `₹${activeUnitCostNum.toFixed(2)}`,
        supplier: 'Apex Organic Produce (Preferred)',
        urgency: 'Critical',
        status: 'Pending Authorization',
        reason: 'Autonomous Restock triggered from Low Stock / Critical Alert monitor',
        financialImpact: `Shields against estimated ₹4,20,000 retail stockout loss`,
        confidenceScore: '99.4%',
        quotes: [
          { vendor: 'Apex Organic Produce (Preferred)', price: `₹${activeUnitCostNum.toFixed(2)}/unit`, leadTime: '3 Days', reliability: '99.4%', selected: true },
          { vendor: 'Global Fresh Alternate', price: `₹${(activeUnitCostNum * 1.15).toFixed(2)}/unit`, leadTime: '5 Days', reliability: '94.0%', selected: false }
        ]
      };

      const approvals = window.SupplyChainState.get('approvals') || DEFAULT_STATE.approvals;
      approvals.unshift(newApproval);
      window.SupplyChainState.set('approvals', approvals);

      // Resolve alert in backend if ID provided
      if (activeModalAlertId) {
        try {
          const apiBase = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';
          await fetch(`${apiBase}/api/inventory/alerts/${activeModalAlertId}/resolve`, { method: 'POST' });
        } catch (e) {
          console.log('Resolve alert note:', e);
        }
      }

      window.closeAiRestockModal();
      window.showToast('Restock PO Generated', `Purchase Order ${poNum} created. Redirecting to Authorization Desk...`, 'success');

      setTimeout(() => {
        window.location.href = `restock-approval.html?highlight=${newApproval.id}`;
      }, 800);
    };
  }

  // --- 14. HACKATHON DEMO TRIGGER: SIMULATE STOCKOUT ---
  window.simulateStockoutDemo = async function(sku = 'SKU-AVO-303') {
    try {
      window.showToast('Triggering Stockout Simulation', 'Simulating warehouse inventory drop below critical threshold...', 'ai');
      const apiBase = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';
      const res = await fetch(`${apiBase}/api/inventory/simulate-stockout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku: sku, simulated_stock: 14 })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update local state inventory
        const inventory = window.SupplyChainState.get('inventory') || DEFAULT_STATE.inventory;
        const targetItem = inventory.find(i => i.sku === (data.simulated_sku || sku));
        if (targetItem) {
          targetItem.onHand = data.current_stock;
          targetItem.status = 'Critical Low';
          targetItem.statusColor = 'error';
          window.SupplyChainState.set('inventory', inventory);
        }

        // Refresh alerts & notification bell
        fetchUnreadAlerts();
        if (window.renderAlertsList) window.renderAlertsList();
        if (window.renderDashboardInventoryRiskWidget) window.renderDashboardInventoryRiskWidget();

        window.showToast('🚨 CRITICAL STOCK ALERT', `${data.product_name} (${data.simulated_sku}) dropped to ${data.current_stock} units. Email alert generated!`, 'error');

        // Automatically open the AI recommendation after a brief delay
        setTimeout(() => {
          window.openAiRestockModal(data.simulated_sku, data.alert);
        }, 1200);
      }
    } catch (e) {
      console.error('Simulate stockout error:', e);
      window.showToast('Simulation Error', 'Failed to trigger stockout simulation.', 'error');
    }
  };

  // --- 15. DASHBOARD INVENTORY RISK WIDGET ---
  window.renderDashboardInventoryRiskWidget = async function() {
    const container = document.getElementById('dashboard-inventory-risk-container');
    if (!container) return;

    try {
      const apiBase = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';
      const res = await fetch(`${apiBase}/api/inventory/alerts?unresolved_only=true`);
      const alerts = res.ok ? await res.json() : [];

      const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
      const lowAlerts = alerts.filter(a => a.severity === 'LOW');
      const highestRiskAlert = criticalAlerts[0] || lowAlerts[0] || alerts[0];

      container.innerHTML = `
        <div class="bg-[#0b1622] border border-[#273647] rounded-2xl p-5 shadow-xl space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">warning</span>
              </div>
              <div>
                <h3 class="font-headline-md text-sm font-bold text-white">Inventory Risk & Stockout Forecast</h3>
                <p class="text-[11px] text-[#8992a8]">Continuous safety buffer monitoring & automated email alerts</p>
              </div>
            </div>
            <button onclick="window.refreshAlertsPanel()" class="px-3 py-1.5 rounded-lg bg-[#1c2b3c] hover:bg-[#273647] text-[#7bd0ff] border border-[#273647] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95">
              <span class="material-symbols-outlined text-sm">sync</span>
              <span>Scan Telemetry</span>
            </button>
          </div>

          <!-- Metric Pills -->
          <div class="grid grid-cols-3 gap-2 text-center font-mono">
            <div class="p-2.5 rounded-xl bg-[#122131] border border-rose-500/30">
              <div class="text-xs text-[#8992a8]">CRITICAL</div>
              <div class="text-base font-extrabold text-rose-400">${criticalAlerts.length}</div>
            </div>
            <div class="p-2.5 rounded-xl bg-[#122131] border border-amber-500/30">
              <div class="text-xs text-[#8992a8]">LOW STOCK</div>
              <div class="text-base font-extrabold text-amber-400">${lowAlerts.length}</div>
            </div>
            <div class="p-2.5 rounded-xl bg-[#122131] border border-emerald-500/30">
              <div class="text-xs text-[#8992a8]">NORMAL</div>
              <div class="text-base font-extrabold text-emerald-400">4</div>
            </div>
          </div>

          <!-- Highest Risk Spotlight Card -->
          ${highestRiskAlert ? `
            <div class="p-3.5 rounded-xl bg-[#122131] border border-rose-500/40 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold text-[10px]">
                  🚨 HIGHEST RISK: ${highestRiskAlert.sku}
                </span>
                <span class="text-[#8992a8] text-[11px]">${highestRiskAlert.warehouse}</span>
              </div>
              <div class="font-bold text-white text-xs">${highestRiskAlert.product_name}</div>
              <div class="flex items-center justify-between text-[11px] font-mono text-[#bec6e0]">
                <span>Current Stock: <strong class="text-rose-400">${highestRiskAlert.current_stock}</strong> / ${highestRiskAlert.reorder_point}</span>
                <span>Buffer: <strong class="text-amber-400">~${highestRiskAlert.ai_recommendation ? highestRiskAlert.ai_recommendation.days_until_stockout : '0.4'} Days</strong></span>
              </div>
              <div class="pt-1 flex items-center gap-2">
                <button onclick="window.openAiRestockModal('${highestRiskAlert.sku}', '${highestRiskAlert.id}')" class="w-full py-2 px-3 rounded-lg bg-[#ff5c35] hover:bg-[#b52701] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all">
                  <span class="material-symbols-outlined text-sm">psychology</span>
                  <span>Review AI Sourcing Recommendation &rarr;</span>
                </button>
              </div>
            </div>
          ` : `
            <div class="p-4 rounded-xl bg-[#122131] border border-emerald-500/30 text-center space-y-1">
              <span class="material-symbols-outlined text-emerald-400 text-xl">check_circle</span>
              <p class="text-xs text-white font-bold">All Inventory Buffers Healthy</p>
              <p class="text-[11px] text-[#8992a8]">Zero stockout penalties projected across global facilities.</p>
            </div>
          `}
        </div>
      `;
    } catch (e) {
      console.error('Error rendering dashboard inventory risk:', e);
    }
  };

  // --- INITIALIZATION HOOKS ---
  function initUnifiedAlertsAndUI() {
    initUnifiedUI();
    injectGlobalUserGuide();
    injectNotificationCenterPanel();
    injectAiRestockModal();
    fetchUnreadAlerts();
    
    if (document.getElementById('dashboard-inventory-risk-container')) {
      window.renderDashboardInventoryRiskWidget();
    }

    // Polling every 45 seconds for continuous telemetry
    if (!alertPollingInterval) {
      alertPollingInterval = setInterval(() => {
        fetchUnreadAlerts();
      }, 45000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnifiedAlertsAndUI);
  } else {
    initUnifiedAlertsAndUI();
  }

})();


