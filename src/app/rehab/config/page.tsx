"use client";
import { ChangeEvent, MouseEvent, useState, SyntheticEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import styled from "styled-components";
import {Container} from "@mui/material";

// ** Icons Imports
// import EyeOutline from 'mdi-material-ui/EyeOutline'
// import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

const StyledButton = styled(Button)`
  && {
    background-color: #1976d1;
    color: #ffffff;
  }`;

interface State {
  password: string
  showPassword: boolean
}

export default function ConfigManagement() {
// ** States
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  })
  const [confirmPassValues, setConfirmPassValues] = useState<State>({
    password: '',
    showPassword: false
  })


  return (
      <Container>
      <Card>
        <CardHeader title='配置管理' titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <form onSubmit={e => e.preventDefault()}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField fullWidth label='Title' placeholder='请输入要改的医院名称' />
              </Grid>


              <Grid item xs={12}>
                <Box
                    sx={{
                      gap: 5,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                >
                  <StyledButton type='submit' variant='contained' size='large' color="secondary">
                    提交
                  </StyledButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      </Container>
  );
}
