import React from 'react'
import { default as api } from '../store/apiSlice';
import { getLabels } from '../helper/helper';

export default function Labels() {
    // We specified the names to these functions as get categories to this function  RTK uses use as the prefix andQuery at the end of the function
    const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery()
    let Transactions;
    if (isFetching) {
        // means we don't have any data inside the data variable 
        Transactions = <div>Fetching</div>
    }
    else if (isSuccess) {
        getLabels(data,'type')
        Transactions = getLabels(data,'type').map((v, i) => <LabelComponent key={i} data={v}></LabelComponent>);
    } else if (isError) {
        Transactions = <div>Error</div>
    }
    return (
        <>
            {Transactions}
        </>
    )
}

function LabelComponent({ data }) {
    if (!data) return <></>;
    return (
        <div className='labels flex justify-between'>
            <div className='flex gap-2'>
                <div className='w-2 h-2 rounded py-3' style={{ background: data.color ?? '#f9c74f' }}></div>
                <h3 className='text-md'>{data.type ?? ''}</h3>
            </div>
            <h3 className='font-bold'>{Math.round(data.percent) ?? 0}</h3>
        </div>
    )
}
