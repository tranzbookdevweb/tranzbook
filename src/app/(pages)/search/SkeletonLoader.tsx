import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';


export default function SkeletonLoader() {
  return (
   <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="hidden lg:block">
            <Skeleton className="h-96 w-full" />
          </div>
          
          <div className="col-span-1 lg:col-span-3">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex justify-between flex-col md:flex-row gap-4">
                      <div className="flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-4">
                          <Skeleton className="h-14 w-14 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-40 mb-1" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <Skeleton className="h-5 w-16 mb-2" />
                        <Skeleton className="h-8 w-24 rounded-full mb-2" />
                        <Skeleton className="h-10 w-24 rounded-md" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>  )
}