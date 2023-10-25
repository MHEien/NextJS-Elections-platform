import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { AreaChart } from 'lucide-react';

export function KPICard() {
    
    return (
        <>
            <Card className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                    <div className="text-primary-500 rounded-lg text-center dark:text-white">
                        <AreaChart size={24} />
                    </div>
                    <div className="text-right">
                        <p className="text-2xl">1,257</p>
                        <p>Elections</p>
                    </div>
                    </div>

                    <div className="progress">
                    <div className="progress-bar bg-primary-500" style={{ width: "55%" }}></div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}