import {routes} from '../lib/content.mjs';
import {link} from '../lib/render.mjs';
export function GET(){return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.filter(p=>!['saved','compare','search'].includes(p)).map(p=>'<url><loc>https://transferxiang.github.io'+link(p)+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});}
