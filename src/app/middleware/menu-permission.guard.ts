import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class MenuPermissionGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree {

        const allowedMenusJson = localStorage.getItem('_LBS_MENU_');
        const url = state.url;

        if (!allowedMenusJson) {
            return this.router.parseUrl('/unauthorized');
        }

        try {
            const menus = JSON.parse(allowedMenusJson) as any[];

            // Recursively extract all URLs
            const collectUrls = (items: any[]): string[] => {
                let urls: string[] = [];
                for (const item of items) {
                    if (item.url) urls.push(item.url.startsWith('/') ? item.url : '/' + item.url);
                    if (item.child) urls = urls.concat(collectUrls(item.child));
                }
                return urls;
            };

            const allowedUrls = collectUrls(menus);

            // Check if the URL starts with any of the allowed URLs
            const isAllowed = allowedUrls.some(menuUrl => url.startsWith(menuUrl));

            return isAllowed ? true : this.router.parseUrl('/unauthorized');

        } catch (error) {
            console.error('Failed to parse _LBS_MENU_', error);
            return this.router.parseUrl('/unauthorized');
        }
    }
}
