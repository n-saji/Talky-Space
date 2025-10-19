"use client";
import { Separator } from "@/components/ui/separator";

import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((seg) => seg.length > 0);
  return (
    <div className="w-full flex items-center justify-start px-4 h-16 py-5">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-2 my-3" />
      <Breadcrumb>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;
            return (
              <Fragment key={href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
          {/* <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem> */}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
