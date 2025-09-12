import React from 'react';
import { FaRegCalendarAlt, FaRegHospital } from 'react-icons/fa';
import { FiMap, FiUsers } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineChartSquareBar } from 'react-icons/hi';
import {
  RiCustomerService2Line,
  RiDashboardLine,
  RiFileUploadLine,
  RiShieldUserLine,
  RiTodoLine,
} from 'react-icons/ri';
import { BiCarousel, BiCartAlt, BiErrorAlt, BiTask } from 'react-icons/bi';
import {
  BsBriefcase,
  BsCart4,
  BsChatDots,
  BsCurrencyBitcoin,
  BsQuestionDiamond,
} from 'react-icons/bs';
import { DiHtml5Multimedia } from 'react-icons/di';
import {
  MdOutlineAnalytics,
  MdOutlineContactPhone,
  MdOutlineContactSupport,
  MdOutlineDns,
  MdOutlineManageAccounts,
} from 'react-icons/md';
import { CgFeed } from 'react-icons/cg';
import { ImFeed, ImLab } from 'react-icons/im';
import { GrDatabase, GrNavigate, GrUserAdmin } from 'react-icons/gr';
import { VscTable, VscTools } from 'react-icons/vsc';
import {
  AiOutlineEdit,
  AiOutlineLayout,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import { RoutePermittedRole } from '@crema/constants/AppEnums';
import { TbFileInvoice } from 'react-icons/tb';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';


const routesConfig = [


  // {
  //   id: 'apps',
  //   title: 'Apps',
  //   messageId: 'sidebar.apps',
  //   type: 'group',
  //   children: [
    
   
  //     // {
  //     //   id: 'ecommerce',
  //     //   title: 'Ecommerce',
  //     //   messageId: 'sidebar.ecommerce',
  //     //   type: 'collapse',
  //     //   icon: <BiCartAlt />,
  //     //   children: [
  //     //     {
  //     //       id: 'products',
  //     //       title: 'Products',
  //     //       messageId: 'sidebar.ecommerce.products',
  //     //       type: 'item',
  //     //       permittedRole: [RoutePermittedRole.User],
  //     //       url: '/ecommerce/products',
  //     //     },
  //     //     {
  //     //       id: 'product_detail',
  //     //       title: 'Product Detail',
  //     //       messageId: 'sidebar.ecommerce.productDetail',
  //     //       type: 'item',
  //     //       permittedRole: [RoutePermittedRole.User],
  //     //       url: '/ecommerce/product_detail',
  //     //     },
  //     //     {
  //     //       id: 'orders',
  //     //       title: 'Orders',
  //     //       messageId: 'sidebar.ecommerce.orders',
  //     //       type: 'item',
  //     //       permittedRole: [RoutePermittedRole.User],
  //     //       url: '/ecommerce/orders',
  //     //     },
  //     //     {
  //     //       id: 'cart',
  //     //       title: 'Cart',
  //     //       messageId: 'sidebar.ecommerce.cart',
  //     //       type: 'item',
  //     //       permittedRole: [RoutePermittedRole.User],
  //     //       url: '/ecommerce/cart',
  //     //     },
  //     //     // {
  //     //     //   id: 'checkout',
  //     //     //   title: 'Checkout',
  //     //     //   messageId: 'sidebar.ecommerce.checkout',
  //     //     //   type: 'item',
  //     //     //   permittedRole: [RoutePermittedRole.User],
  //     //     //   url: '/ecommerce/checkout',
  //     //     // },
  //     //     // {
  //     //     //   id: 'confirmation',
  //     //     //   title: 'Confirmation',
  //     //     //   messageId: 'sidebar.ecommerce.confirmation',
  //     //     //   type: 'item',
  //     //     //   permittedRole: [RoutePermittedRole.User],
  //     //     //   url: '/ecommerce/confirmation',
  //     //     // },
  //     //     // {
  //     //     //   id: 'invoice-1',
  //     //     //   title: 'Invoice 1',
  //     //     //   messageId: 'sidebar.ecommerce.invoice1',
  //     //     //   type: 'item',
  //     //     //   permittedRole: [RoutePermittedRole.User],
  //     //     //   url: '/ecommerce/invoice-1',
  //     //     // },
  //     //     // {
  //     //     //   id: 'invoice-2',
  //     //     //   title: 'Invoice 2',
  //     //     //   messageId: 'sidebar.ecommerce.invoice2',
  //     //     //   type: 'item',
  //     //     //   permittedRole: [RoutePermittedRole.User],
  //     //     //   url: '/ecommerce/invoice-2',
  //     //     // },
  //     //   ],
  //     // },
    
    
  //   ],
  // },
  
  {
    id: 'admin-ecommerce',
    title: 'Ecommerce Admin',
    messageId: 'sidebar.ecommerceAdmin',
    type: 'collapse',
    icon: <AdminPanelSettingsIcon fontSize="small"/>,
    children: [
      {
        id: 'productListing',
        title: 'Product Listing',
        messageId: 'sidebar.ecommerceAdmin.productListing',
        type: 'item',
        icon: <SettingsApplicationsIcon fontSize="small"/>,
        permittedRole: [RoutePermittedRole.Admin],
        url: '/ecommerce/product-listing',
      },
      {
        id: 'addProducts',
        title: 'Add Products',
        messageId: 'sidebar.ecommerceAdmin.addProducts',
        type: 'item',
        icon: <AddToPhotosIcon fontSize="small"/>,
        permittedRole: [RoutePermittedRole.Admin],
        url: '/ecommerce/add-products',
      },
      // {
      //   id: 'customers',
      //   title: 'Customers',
      //   messageId: 'sidebar.ecommerce.customers',
      //   type: 'item',
      //   permittedRole: [RoutePermittedRole.Admin],
      //   url: '/ecommerce/customers',
      // },
      {
        id: 'orders',
        title: 'Order',
        messageId: 'sidebar.ecommerce.customers',
        type: 'item',
        icon: <AddShoppingCartIcon fontSize="small"/>,

        permittedRole: [RoutePermittedRole.Admin],
        url: '/ecommerce/order-management',
      },
    ],
  },
  // {
  //   id: 'extra-pages',
  //   title: 'Extra Pages',
  //   messageId: 'sidebar.pages.extraPages',
  //   type: 'group',
  //   children: [
  //     {
  //       id: 'account',
  //       title: 'Account',
  //       messageId: 'sidebar.pages.extraPages.account',
  //       type: 'item',
  //       permittedRole: [RoutePermittedRole.User ],
  //       icon: <MdOutlineManageAccounts />,
  //       url: '/my-profile',
  //     },
      
  //     // {
  //     //   id: 'pricing',
  //     //   title: 'Pricing',
  //     //   messageId: 'sidebar.pages.extraPages.pricing',
  //     //   type: 'collapse',
  //     //   permittedRole: [RoutePermittedRole.User],
  //     //   icon: 'attach_money',
  //     //   url: '/extra-pages/pricing',
  //     //   children: [
  //     //     {
  //     //       id: 'pricingListing',
  //     //       title: 'Pricing Listing',
  //     //       messageId: 'sidebar.pages.extraPages.pricingListing',
  //     //       type: 'item',
  //     //       permittedRole: [RoutePermittedRole.User],
  //     //       url: '/extra-pages/pricing-listing',
  //     //     },
  //     //     {
  //     //       id: 'pricingDetail',
  //     //       title: 'Pricing Detail',
  //     //       messageId: 'sidebar.pages.extraPages.pricingDetail',
  //     //       type: 'item',
  //     //       permittedRole: [RoutePermittedRole.User],
  //     //       url: '/extra-pages/pricing-detail',
  //     //     },
  //     //   ],
  //     // },
  
 
  //   ],
  // },
];
export default routesConfig;
