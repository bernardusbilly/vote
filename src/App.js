import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Space, Typography } from 'antd';
import { Pie, G2 } from '@ant-design/plots';
import 'antd/dist/antd.css';
import './style.scss';

const { Title } = Typography;
const G = G2.getEngine('canvas');

// For BCI Voting Only
const defaultOptions = [
  {
    name: "Diah Wihardini",
    notes: "PhD in Education, Cal 2016",
    counter: 0,
  },
  {
    name: "Freddy Samad",
    notes: "B. Sc. in Civil and Environmental Engineering, Cal 2000",
    counter: 0,
  },
];

const config = {
  appendPadding: 10,
  angleField: 'value',
  colorField: 'type',
  radius: 0.75,
  legend: false,
  label: {
    type: 'spider',
    labelHeight: 40,
    formatter: (data, mappingData) => {
      const group = new G.Group({});
      group.addShape({
        type: 'circle',
        attrs: {
          x: 0,
          y: 0,
          width: 40,
          height: 50,
          r: 5,
          fill: mappingData.color,
        },
      });
      group.addShape({
        type: 'text',
        attrs: {
          x: 10,
          y: 8,
          text: `${data.type}`,
          fill: mappingData.color,
        },
      });
      group.addShape({
        type: 'text',
        attrs: {
          x: 0,
          y: 25,
          text: `${data.value} - ${(data.percent * 100).toFixed(1)}%`,
          fill: 'rgba(0, 0, 0, 0.65)',
          fontWeight: 700,
        },
      });
      return group;
    },
  },
  interactions: [
    {
      type: 'element-selected',
    },
    {
      type: 'element-active',
    },
  ],
  innerRadius: 0.5,
};

function App() {
  const [editing, setEditing] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [optionNotes, setOptionNotes] = useState('');
  const [totalVotes, setTotalVotes] = useState(0);
  const [options, setOptions] = useState(defaultOptions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  });

  const handleAddOption = () => {
    if (optionName) {
      const option = {
        name: optionName,
        notes: optionNotes,
        counter: 0,
      };
      setOptionName('');
      setOptionNotes('');
      setOptions([ ...options, option ]);
    }
  };

  const handleRemoveOption = (index) => () => {
    options.splice(index, 1);
    setOptions([ ...options ]);
  }

  const handleCounter = (index, delta) => () => {
    const option = options[index];
    
    if (delta < 0 && option.counter === 0) {
      return;
    }
    option.counter = option.counter + delta;
    setOptions([ ...options ]);
    setTotalVotes(totalVotes + delta)
  };

  return loading ? (
    <div className="loader animate__animated animate__fadeOut">
      <img
        alt="loading"
        className="loader-spin"
        src={`${process.env.PUBLIC_URL}/berkeley-bear.jpeg`}
      />
    </div>
  ) : (
    <div className="app animate__animated animate__fadeIn">
      <Space direction='vertical' className="app-section">
        <Pie style={{ minWidth: '800px' }} {...config} data={options.map(({ name, counter }) => ({ type: name, value: counter }))}/>
        <Space direction='vertical' split={<Divider type="horizontal" />}>
          {options.map(({ name = '', counter = 0, notes = '' }, index) => {
            return <div key={name} style={{ display: 'flex', alignItems: "center" }}>
              {editing && <Button type="dashed" onClick={handleRemoveOption(index)} style={{ marginRight: '16px' }} >-</Button>}
              <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <Title level={3}>{name}</Title>
                  {notes}
                </div>
                <Divider type="vertical" />
                <Space>
                  {totalVotes > 0 && `${counter} - ${(counter*100/totalVotes).toFixed(1)}%`}
                  <Space>
                    <Button onClick={handleCounter(index, 1)}>+</Button>    
                    <Button onClick={handleCounter(index, -1)}>-</Button>    
                  </Space>
                </Space>
              </Space>
            </div>
          })}
        </Space>
        <Button style={{ marginTop: '16px' }} type="dashed" onClick={() => setEditing(!editing)}>
          {editing ? 'Stop Editing' : 'Edit'}
        </Button>
        {
          editing && <Form>
            <Space>
              <Input type="text" placeholder="Option" value={optionName} onChange={e => setOptionName(e.target.value)} />
              <Input type="text" placeholder="Optional Notes" value={optionNotes} onChange={e => setOptionNotes(e.target.value)} />
              <Button onClick={handleAddOption} htmlType="submit">Add</Button>
            </Space>
          </Form>
        }
      </Space>
    </div>
  );
}

export default App;
